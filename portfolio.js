(() => {
    const layoutExperienceTimeline = () => {
        const scale = document.querySelector(".experience-year-scale");
        const stack = document.querySelector(".experience-stack");
        if (!scale || !stack) {
            return;
        }

        const entries = [...stack.querySelectorAll(".experience-entry")];
        if (entries.length === 0) {
            return;
        }

        const scaleTop = scale.getBoundingClientRect().top;
        const scaleHeight = Math.max(scale.getBoundingClientRect().height, stack.getBoundingClientRect().height);
        scale.style.minHeight = `${Math.ceil(scaleHeight)}px`;

        const dotCenterY = (entry) => {
            const dot = entry.querySelector(".experience-entry__dot");
            if (!dot) {
                return null;
            }
            const rect = dot.getBoundingClientRect();
            return rect.top + rect.height / 2 - scaleTop;
        };

        // Outgoing rail segments: match length to next entry's dot.
        for (let index = 0; index < entries.length - 1; index += 1) {
            const currentDot = entries[index].querySelector(".experience-entry__dot");
            const nextDot = entries[index + 1].querySelector(".experience-entry__dot");
            const rail = entries[index].querySelector(".experience-entry__rail");
            if (!currentDot || !nextDot || !rail) {
                continue;
            }
            const span =
                nextDot.getBoundingClientRect().top +
                nextDot.getBoundingClientRect().height / 2 -
                (currentDot.getBoundingClientRect().top + currentDot.getBoundingClientRect().height / 2);
            rail.style.setProperty("--segment-length", `${Math.max(24, Math.round(span))}px`);
        }

        // Year → Y map. Newest-first page: role end sits higher, role start sits lower on long spans.
        const yearTops = new Map();
        const setYearTop = (year, top, { allowLower = false } = {}) => {
            if (!Number.isFinite(year) || top == null) {
                return;
            }
            if (!yearTops.has(year)) {
                yearTops.set(year, top);
                return;
            }
            if (allowLower && top > yearTops.get(year)) {
                yearTops.set(year, top);
            }
        };

        for (const entry of entries) {
            if (entry.classList.contains("experience-entry--current") && entries.length > 1) {
                continue;
            }

            const startYear = Number(entry.dataset.startYear);
            const endYear = Number(entry.dataset.endYear || startYear);
            const top = dotCenterY(entry);
            if (!Number.isFinite(startYear) || top == null) {
                continue;
            }

            const entryRect = entry.getBoundingClientRect();
            const entryBottom = entryRect.bottom - scaleTop - 28;
            const isFoundation = entry === entries[entries.length - 1];
            const spansYears = Number.isFinite(endYear) && endYear > startYear;

            if (spansYears) {
                // More recent end of the span near the top of the card (after previous role).
                setYearTop(endYear, top);
                // Career start lower on the card — foundation began late 2013, not at the header line.
                const startRatio = isFoundation ? 0.9 : 0.55;
                const startTop = top + Math.max(24, (entryBottom - top) * startRatio);
                setYearTop(startYear, startTop, { allowLower: true });
            } else {
                setYearTop(startYear, top);
            }
        }

        const yearAnchors = [...yearTops.entries()]
            .map(([year, top]) => ({ year, top }))
            .sort((left, right) => right.year - left.year);

        const topForYear = (year) => {
            const exact = yearAnchors.find((anchor) => anchor.year === year);
            if (exact) {
                return exact.top;
            }
            for (let index = 0; index < yearAnchors.length - 1; index += 1) {
                const high = yearAnchors[index];
                const low = yearAnchors[index + 1];
                if (high.year >= year && year >= low.year) {
                    const ratio = (high.year - year) / (high.year - low.year);
                    return high.top + ratio * (low.top - high.top);
                }
            }
            if (yearAnchors.length === 0) {
                return null;
            }
            if (year > yearAnchors[0].year) {
                return yearAnchors[0].top;
            }
            return yearAnchors[yearAnchors.length - 1].top;
        };

        const nowTick = scale.querySelector('[data-year-tick="now"]');
        const current = stack.querySelector(".experience-entry--current");
        if (nowTick && current) {
            const top = dotCenterY(current);
            if (top != null) {
                nowTick.style.top = `${Math.round(top)}px`;
            }
        }

        for (const tick of scale.querySelectorAll("[data-year-tick]")) {
            const key = tick.getAttribute("data-year-tick");
            if (key === "now") {
                continue;
            }
            const year = Number(key);
            const top = topForYear(year);
            if (top == null) {
                continue;
            }
            tick.style.top = `${Math.round(top)}px`;
        }
    };

    const scheduleLayout = () => {
        window.requestAnimationFrame(() => {
            layoutExperienceTimeline();
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scheduleLayout, { once: true });
    } else {
        scheduleLayout();
    }

    window.addEventListener("resize", scheduleLayout);
    if (document.fonts?.ready) {
        document.fonts.ready.then(scheduleLayout).catch(() => {});
    }

    const stack = document.querySelector(".experience-stack");
    if (stack && typeof ResizeObserver !== "undefined") {
        new ResizeObserver(scheduleLayout).observe(stack);
    }
})();
