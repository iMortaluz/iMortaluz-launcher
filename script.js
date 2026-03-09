const manifestUrl = "https://raw.githubusercontent.com/iMortaluz/minecraft-duyuru/main/launcher-update.json";
const versionBadge = document.getElementById("versionBadge");
const releaseNotesEl = document.getElementById("releaseNotes");
const downloadButtons = Array.from(document.querySelectorAll("#downloadButton, #downloadButtonSecondary"));
const currentYearEl = document.getElementById("year");
const heroImageEl = document.getElementById("heroImage");
const latestVersionTextEl = document.getElementById("latestVersionText");
const platformFileNameEl = document.getElementById("platformFileName");
const badgeVersionTextEl = document.getElementById("badgeVersionText");
const badgeStatusTextEl = document.getElementById("badgeStatusText");

currentYearEl.textContent = new Date().getFullYear();

async function hydrateManifest() {
    try {
        const response = await fetch(manifestUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Manifest getirilemedi");
        const manifest = await response.json();

        if (manifest.latestVersion) {
            if (badgeVersionTextEl) {
                badgeVersionTextEl.textContent = `v${manifest.latestVersion}`;
            } else {
                versionBadge.textContent = `v${manifest.latestVersion} • Güncel`;
            }
            if (latestVersionTextEl) latestVersionTextEl.textContent = `v${manifest.latestVersion}`;
        }

        if (manifest.releaseNotes) {
            releaseNotesEl.textContent = manifest.releaseNotes;
        } else {
            releaseNotesEl.textContent = "Her sürümde yeni iyileştirmeler seni bekliyor.";
        }

        if (manifest.status && badgeStatusTextEl) {
            badgeStatusTextEl.textContent = manifest.status;
        }

        if (manifest.downloadUrl) {
            downloadButtons.forEach((btn) => (btn.href = manifest.downloadUrl));
            if (platformFileNameEl) {
                try {
                    const url = new URL(manifest.downloadUrl);
                    const fileName = url.pathname.split("/").pop();
                    if (fileName) platformFileNameEl.textContent = decodeURIComponent(fileName);
                } catch {
                    // ignore
                }
            }
        }

    } catch (error) {
        releaseNotesEl.textContent = "Manifest alınamadı. Lütfen daha sonra tekrar dene.";
        console.error("Manifest yüklenemedi", error);
    }
}

hydrateManifest();

const heroImages = [
    "./assets/hero-1.png",
    "./assets/hero-2.png",
    "./assets/hero-3.png",
    "./assets/hero-4.png",
    "./assets/hero-5.png",
];

let heroIndex = 0;

function cycleHeroImage() {
    if (!heroImageEl) return;

    const nextIndex = (heroIndex + 1) % heroImages.length;
    heroImageEl.classList.add("is-fading");

    window.setTimeout(() => {
        heroIndex = nextIndex;
        heroImageEl.src = heroImages[heroIndex];
        heroImageEl.classList.remove("is-fading");
    }, 260);
}

if (heroImageEl) {
    window.setInterval(cycleHeroImage, 4500);
}
