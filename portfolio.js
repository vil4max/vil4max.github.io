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

        // Mile / origin anchors (emphasized years).
        const yearTops = new Map();
        for (const entry of entries) {
            if (entry.classList.contains("experience-entry--current") && entries.length > 1) {
                continue;
            }
            const mileYear = Number(entry.dataset.startYear);
            const top = dotCenterY(entry);
            if (Number.isFinite(mileYear) && top != null && !yearTops.has(mileYear)) {
                yearTops.set(mileYear, top);
            }

            const originYear = Number(entry.dataset.originYear);
            if (Number.isFinite(originYear)) {
                const bottom = entry.getBoundingClientRect().bottom - scaleTop - 10;
                yearTops.set(originYear, Math.max(top ?? 0, bottom));
            }
        }

        const anchors = [...yearTops.entries()]
            .map(([year, top]) => ({ year, top }))
            .sort((left, right) => right.year - left.year);

        const topForYear = (year) => {
            if (yearTops.has(year)) {
                return yearTops.get(year);
            }
            for (let index = 0; index < anchors.length - 1; index += 1) {
                const high = anchors[index];
                const low = anchors[index + 1];
                if (high.year >= year && year >= low.year) {
                    const ratio = (high.year - year) / (high.year - low.year);
                    return high.top + ratio * (low.top - high.top);
                }
            }
            if (anchors.length === 0) {
                return null;
            }
            if (year > anchors[0].year) {
                return anchors[0].top;
            }
            return anchors[anchors.length - 1].top;
        };

        const nowTick = scale.querySelector('[data-year-tick="now"]');
        const current = stack.querySelector(".experience-entry--current");
        if (nowTick && current) {
            const top = dotCenterY(current);
            if (top != null) {
                nowTick.style.top = `${Math.round(top)}px`;
                nowTick.style.visibility = "";
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
