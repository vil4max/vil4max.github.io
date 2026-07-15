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

        // One anchor per role start year, pinned to that role's mile-dot (newest-first).
        // Do not spread years through a multi-year card's body — that misaligns with Earlier bullets.
        const yearTops = new Map();
        for (const entry of entries) {
            if (entry.classList.contains("experience-entry--current") && entries.length > 1) {
                continue;
            }
            const startYear = Number(entry.dataset.startYear);
            const top = dotCenterY(entry);
            if (!Number.isFinite(startYear) || top == null || yearTops.has(startYear)) {
                continue;
            }
            yearTops.set(startYear, top);
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

        // Hide year ticks that would fall inside a multi-year entry body (below its mile-dot).
        // Those years belong in the gap between roles, not beside Earlier bullets.
        const blockedRanges = entries
            .filter((entry) => {
                const start = Number(entry.dataset.startYear);
                const end = Number(entry.dataset.endYear || start);
                return Number.isFinite(start) && Number.isFinite(end) && end - start >= 2;
            })
            .map((entry) => {
                const top = dotCenterY(entry);
                const bottom = entry.getBoundingClientRect().bottom - scaleTop;
                return top == null ? null : { top: top + 18, bottom };
            })
            .filter(Boolean);

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

            const insideBody = blockedRanges.some((range) => top > range.top && top < range.bottom - 8);
            const isAnchor = yearTops.has(year);
            if (insideBody && !isAnchor) {
                tick.style.visibility = "hidden";
                continue;
            }

            tick.style.visibility = "";
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
