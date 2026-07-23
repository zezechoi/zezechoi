import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "tmp", "qa");
const profileDir = path.join(outputDir, "chrome-cdp");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const captureScreenshots = process.argv.includes("--screenshots");

await mkdir(outputDir, { recursive: true });
await rm(profileDir, { recursive: true, force: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--allow-file-access-from-files",
  "--remote-debugging-port=0",
  `--user-data-dir=${profileDir}`,
  "about:blank"
], {
  stdio: "ignore",
  windowsHide: true
});

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function waitForTarget() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const activePort = await readFile(path.join(profileDir, "DevToolsActivePort"), "utf8");
      const [port] = activePort.trim().split(/\r?\n/);
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find(target => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools target did not become available.");
}

const target = await waitForTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;

socket.addEventListener("message", async event => {
  const raw = typeof event.data === "string" ? event.data : await event.data.text();
  const message = JSON.parse(raw);
  if (!message.id) return;
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});
socket.addEventListener("close", () => {
  for (const request of pending.values()) {
    request.reject(new Error("Chrome DevTools socket closed before the request completed."));
  }
  pending.clear();
});

if (socket.readyState !== WebSocket.OPEN) {
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
}

function send(method, params = {}, timeoutMilliseconds = 10000) {
  const id = nextId;
  nextId += 1;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Chrome DevTools request timed out: ${method}`));
    }, timeoutMilliseconds);
    pending.set(id, {
      resolve: value => {
        clearTimeout(timeout);
        resolve(value);
      },
      reject: error => {
        clearTimeout(timeout);
        reject(error);
      }
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function navigate(fileName, viewport) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile
  });
  await send("Emulation.setTouchEmulationEnabled", { enabled: viewport.mobile });
  await send("Page.navigate", { url: pathToFileURL(path.join(root, fileName)).href });
  await delay(1200);
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Browser evaluation failed.");
  }
  return result.result.value;
}

async function screenshot(name) {
  const metrics = await send("Page.getLayoutMetrics");
  const content = metrics.cssContentSize || metrics.contentSize;
  const height = Math.min(Math.ceil(content.height), 1800);
  const result = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(content.width),
      height,
      scale: 1
    }
  }, 45000);
  await writeFile(path.join(outputDir, `${name}.png`), Buffer.from(result.data, "base64"));
}

async function screenshotSection(selector, name, maximumHeight = 1800) {
  const box = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      x: 0,
      y: rect.top + window.scrollY,
      width: document.documentElement.scrollWidth,
      height: Math.min(rect.height, ${maximumHeight})
    };
  })()`);
  if (!box) throw new Error(`Screenshot target not found: ${selector}`);
  const result = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip: { ...box, scale: 1 }
  }, 45000);
  await writeFile(path.join(outputDir, `${name}.png`), Buffer.from(result.data, "base64"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  await send("Page.enable");
  await send("Runtime.enable");

  await navigate("index.html", { width: 1440, height: 1200, mobile: false });
  const indexDesktop = await evaluate(`({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    latest: document.querySelectorAll("[data-portfolio-latest] .kb-row").length,
    edition: document.querySelector("[data-portfolio-edition]")?.textContent.trim()
  })`);
  assert(indexDesktop.scrollWidth <= indexDesktop.viewport, "Homepage overflows horizontally on desktop.");
  assert(indexDesktop.latest === 3, "Homepage must render the latest three K-Beauty issues.");
  assert(indexDesktop.edition === "03", "Homepage Edition did not render from canonical data.");
  if (captureScreenshots) {
    await screenshot("index-desktop-full");
    await screenshotSection("#work", "index-work-desktop");
    await screenshotSection("#capabilities", "index-capabilities-desktop");
  }

  await navigate("index.html", { width: 390, height: 844, mobile: true });
  const indexMobile = await evaluate(`({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    stampWidth: document.querySelector(".hero-stamp")?.getBoundingClientRect().width,
    heroWidth: document.querySelector(".hero")?.getBoundingClientRect().width
  })`);
  assert(indexMobile.scrollWidth <= indexMobile.viewport, `Homepage mobile overflow: ${indexMobile.scrollWidth}px > ${indexMobile.viewport}px.`);
  assert(indexMobile.stampWidth <= indexMobile.heroWidth, "Mobile hero stamp exceeds the hero width.");
  if (captureScreenshots) await screenshot("index-mobile-full");

  await navigate("archive.html", { width: 1440, height: 1200, mobile: false });
  const archiveDesktop = await evaluate(`(() => {
    const visible = () => [...document.querySelectorAll("[data-portfolio-archive] .card")].filter(card => !card.hidden).length;
    const click = filter => document.querySelector('[data-filter="' + filter + '"]').click();
    const allCards = [...document.querySelectorAll("[data-portfolio-archive] .card")];
    click("strategy");
    const strategy = visible();
    click("research");
    const research = visible();
    click("all");
    return {
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      total: allCards.length,
      uniqueLinks: new Set(allCards.map(card => card.href)).size,
      strategy,
      research,
      all: visible(),
      totalLabel: document.querySelector("[data-portfolio-total]")?.textContent.trim()
    };
  })()`);
  assert(archiveDesktop.scrollWidth <= archiveDesktop.viewport, "Archive overflows horizontally on desktop.");
  assert(archiveDesktop.total === 9 && archiveDesktop.uniqueLinks === 9, "Archive must render nine unique issue links.");
  assert(archiveDesktop.strategy === 7 && archiveDesktop.research === 2 && archiveDesktop.all === 9, "Archive filters returned incorrect counts.");
  assert(archiveDesktop.totalLabel === "9 published · 2 series", "Archive total label is inconsistent.");
  if (captureScreenshots) {
    await screenshot("archive-desktop-full");
    await screenshotSection("#recent", "archive-cards-desktop");
  }

  await navigate("archive.html", { width: 390, height: 844, mobile: true });
  const archiveMobile = await evaluate(`({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    cards: document.querySelectorAll("[data-portfolio-archive] .card").length
  })`);
  assert(archiveMobile.scrollWidth <= archiveMobile.viewport, `Archive mobile overflow: ${archiveMobile.scrollWidth}px > ${archiveMobile.viewport}px.`);
  assert(archiveMobile.cards === 9, "Archive mobile view did not render all issues.");
  if (captureScreenshots) await screenshot("archive-mobile-full");

  console.log(JSON.stringify({
    status: "passed",
    indexDesktop,
    indexMobile,
    archiveDesktop,
    archiveMobile
  }, null, 2));
} finally {
  socket.close();
  chrome.kill();
}
