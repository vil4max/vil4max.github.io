(() => {
    const PORTRAIT_MAX = 1.0;
    const LANDSCAPE_MIN = 1.25;
    const DEFAULT_PHONE_RATIO = 0.46;
    const RATIO_TOLERANCE = 0.14;
    const DESKTOP_MEDIA_MIN = 901;
    const TILE_GAP = 12;

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

    const getImageRatio = (img) => {
        const width = Number(img.getAttribute("width")) || img.naturalWidth;
        const height = Number(img.getAttribute("height")) || img.naturalHeight;
        if (!width || !height) {
            return DEFAULT_PHONE_RATIO;
        }
        return width / height;
    };

    const ratiosAreSimilar = (ratios) => {
        if (ratios.length < 2) {
            return true;
        }
        const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
        return ratios.every((ratio) => Math.abs(ratio - average) / average <= RATIO_TOLERANCE);
    };

    const gridPlan = (count, columns, rows) => {
        const cells = [];
        for (let index = 0; index < count; index += 1) {
            cells.push({
                index,
                column: index % columns,
                row: Math.floor(index / columns),
                columnSpan: 1,
                rowSpan: 1,
            });
        }
        return { columns, rows, cells };
    };

    const layoutThreeLandscape = () => ({
        columns: 2,
        rows: 2,
        cells: [
            { index: 0, column: 0, row: 0, columnSpan: 2, rowSpan: 1 },
            { index: 1, column: 0, row: 1, columnSpan: 1, rowSpan: 1 },
            { index: 2, column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
        ],
    });

    const layoutFivePortrait = () => ({
        columns: 6,
        rows: 2,
        cells: [
            { index: 0, column: 0, row: 0, columnSpan: 2, rowSpan: 1 },
            { index: 1, column: 2, row: 0, columnSpan: 2, rowSpan: 1 },
            { index: 2, column: 4, row: 0, columnSpan: 2, rowSpan: 1 },
            { index: 3, column: 1, row: 1, columnSpan: 2, rowSpan: 1 },
            { index: 4, column: 3, row: 1, columnSpan: 2, rowSpan: 1 },
        ],
    });

    const layoutMosaicFour = (portraitIndex) => {
        const others = [0, 1, 2, 3].filter((index) => index !== portraitIndex);
        return {
            columns: 3,
            rows: 2,
            cells: [
                { index: portraitIndex, column: 0, row: 0, columnSpan: 1, rowSpan: 2 },
                { index: others[0], column: 1, row: 0, columnSpan: 1, rowSpan: 1 },
                { index: others[1], column: 2, row: 0, columnSpan: 1, rowSpan: 1 },
                { index: others[2], column: 1, row: 1, columnSpan: 2, rowSpan: 1 },
            ],
        };
    };

    const layoutMosaicFourMobile = (portraitIndex) => {
        const others = [0, 1, 2, 3].filter((index) => index !== portraitIndex);
        return {
            columns: 2,
            rows: 3,
            cells: [
                { index: portraitIndex, column: 0, row: 0, columnSpan: 2, rowSpan: 1 },
                { index: others[0], column: 0, row: 1, columnSpan: 1, rowSpan: 1 },
                { index: others[1], column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
                { index: others[2], column: 0, row: 2, columnSpan: 2, rowSpan: 1 },
            ],
        };
    };

    const resolveMosaicPortraitIndex = (ratios) => {
        const portraitIndexes = ratios
            .map((ratio, index) => ({ ratio, index }))
            .filter(({ ratio }) => ratio < PORTRAIT_MAX);
        if (portraitIndexes.length === 1) {
            return portraitIndexes[0].index;
        }
        return portraitIndexes.sort((left, right) => left.ratio - right.ratio)[0]?.index ?? 0;
    };

    const planTileLayout = (ratios) => {
        const count = ratios.length;
        const isMobile = window.innerWidth < DESKTOP_MEDIA_MIN;
        const allPortrait = ratios.every((ratio) => ratio < PORTRAIT_MAX);
        const allLandscape = ratios.every((ratio) => ratio >= LANDSCAPE_MIN);
        const similar = ratiosAreSimilar(ratios);
        const portraitCount = ratios.filter((ratio) => ratio < PORTRAIT_MAX).length;
        const landscapeCount = ratios.filter((ratio) => ratio >= LANDSCAPE_MIN).length;
        const isMosaicFour =
            count === 4 &&
            ((portraitCount === 1 && landscapeCount === 3) || (portraitCount === 3 && landscapeCount === 1));

        if (isMosaicFour) {
            const portraitIndex = resolveMosaicPortraitIndex(ratios);
            return isMobile ? layoutMosaicFourMobile(portraitIndex) : layoutMosaicFour(portraitIndex);
        }

        if (similar && allPortrait) {
            if (count === 3) {
                return gridPlan(3, 3, 1);
            }
            if (count === 4) {
                return gridPlan(4, 2, 2);
            }
            if (count === 5) {
                return layoutFivePortrait();
            }
            if (count === 6) {
                return gridPlan(6, 3, 2);
            }
        }

        if (similar && allLandscape) {
            if (count === 3) {
                return layoutThreeLandscape();
            }
            if (count === 4) {
                return gridPlan(4, 2, 2);
            }
        }

        if (count === 5 && ratios.every((ratio) => ratio < 1)) {
            return layoutFivePortrait();
        }

        const columns = isMobile ? Math.min(3, count) : Math.min(3, count);
        return gridPlan(count, columns, Math.ceil(count / columns));
    };

    const estimatePlanHeight = (plan, ratios, width) => {
        const gap = TILE_GAP;
        const columnWidth = (width - gap * (plan.columns - 1)) / plan.columns;
        const rowHeights = Array.from({ length: plan.rows }, () => 0);

        for (const cell of plan.cells) {
            const ratio = ratios[cell.index] ?? 1;
            const cellWidth = columnWidth * cell.columnSpan + gap * (cell.columnSpan - 1);
            const cellHeight = cellWidth / ratio;
            const rowShare = cellHeight / cell.rowSpan;
            for (let row = cell.row; row < cell.row + cell.rowSpan; row += 1) {
                rowHeights[row] = Math.max(rowHeights[row], rowShare);
            }
        }

        return rowHeights.reduce((sum, height) => sum + height, 0) + gap * (plan.rows - 1);
    };

    const applyTileLayout = (container) => {
        const images = [...container.querySelectorAll("img")];
        if (images.length === 0) {
            return;
        }

        const ratios = images.map((img) => getImageRatio(img));
        const plan = planTileLayout(ratios);

        container.classList.add("case-study__media--tiled");
        container.style.display = "grid";
        container.style.gap = `${TILE_GAP}px`;
        container.style.gridTemplateColumns = `repeat(${plan.columns}, minmax(0, 1fr))`;
        container.style.gridTemplateRows = `repeat(${plan.rows}, minmax(0, 1fr))`;

        for (const image of images) {
            image.style.gridColumn = "";
            image.style.gridRow = "";
        }

        for (const cell of plan.cells) {
            const image = images[cell.index];
            if (!image) {
                continue;
            }
            image.style.gridColumn = `${cell.column + 1} / span ${cell.columnSpan}`;
            image.style.gridRow = `${cell.row + 1} / span ${cell.rowSpan}`;
        }

        const study = container.closest(".case-study--media");
        const copy = study?.querySelector(".case-study__copy");
        container.style.height = "";

        if (!copy || window.innerWidth < DESKTOP_MEDIA_MIN) {
            const naturalHeight = estimatePlanHeight(plan, ratios, container.clientWidth || container.offsetWidth);
            if (naturalHeight > 0) {
                container.style.height = `${Math.ceil(naturalHeight)}px`;
            }
            return;
        }

        const width = container.clientWidth || container.offsetWidth;
        const copyHeight = copy.offsetHeight;
        const naturalHeight = estimatePlanHeight(plan, ratios, width);
        const targetHeight = Math.max(copyHeight, naturalHeight);
        if (targetHeight > 0) {
            container.style.height = `${Math.ceil(targetHeight)}px`;
        }
    };

    const layoutProjectMediaTiles = () => {
        for (const container of document.querySelectorAll(".case-study__media:not(.case-study__media--watch)")) {
            applyTileLayout(container);
        }
    };

    const scheduleLayout = () => {
        window.requestAnimationFrame(() => {
            layoutExperienceTimeline();
            layoutProjectMediaTiles();
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

    for (const container of document.querySelectorAll(".case-study__media:not(.case-study__media--watch)")) {
        for (const image of container.querySelectorAll("img")) {
            if (!image.complete) {
                image.addEventListener("load", scheduleLayout, { once: true });
            }
        }
        if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(scheduleLayout).observe(container);
        }
    }

    const copyBlocks = document.querySelectorAll(".case-study--media .case-study__copy");
    if (typeof ResizeObserver !== "undefined") {
        for (const copy of copyBlocks) {
            new ResizeObserver(scheduleLayout).observe(copy);
        }
    }
})();
