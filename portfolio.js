(() => {
    const DEFAULT_PHONE_RATIO = 0.46;
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

    const layoutHeroDetails = () => ({
        columns: 2,
        rows: 2,
        cells: [
            { index: 0, column: 0, row: 0, columnSpan: 1, rowSpan: 2 },
            { index: 1, column: 1, row: 0, columnSpan: 1, rowSpan: 1 },
            { index: 2, column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
        ],
    });

    const layoutHeroDetailsMobile = () => ({
        columns: 2,
        rows: 2,
        cells: [
            { index: 0, column: 0, row: 0, columnSpan: 2, rowSpan: 1 },
            { index: 1, column: 0, row: 1, columnSpan: 1, rowSpan: 1 },
            { index: 2, column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
        ],
    });

    const layoutProductContext = () => ({
        columns: 2,
        rows: 2,
        cells: [
            { index: 0, column: 0, row: 0, columnSpan: 2, rowSpan: 1 },
            { index: 1, column: 0, row: 1, columnSpan: 1, rowSpan: 1 },
            { index: 2, column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
        ],
    });

    const layoutProductContextMobile = () => layoutProductContext();

    const layoutRow3 = () => ({
        columns: 3,
        rows: 1,
        cells: [
            { index: 0, column: 0, row: 0, columnSpan: 1, rowSpan: 1 },
            { index: 1, column: 1, row: 0, columnSpan: 1, rowSpan: 1 },
            { index: 2, column: 2, row: 0, columnSpan: 1, rowSpan: 1 },
        ],
    });

    const layoutOnePlusTwoByTwo = (featuredIndex) => {
        const others = [0, 1, 2, 3, 4].filter((index) => index !== featuredIndex).slice(0, 4);
        return {
            columns: 3,
            rows: 2,
            cells: [
                { index: featuredIndex, column: 0, row: 0, columnSpan: 1, rowSpan: 2 },
                { index: others[0], column: 1, row: 0, columnSpan: 1, rowSpan: 1 },
                { index: others[1], column: 2, row: 0, columnSpan: 1, rowSpan: 1 },
                { index: others[2], column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
                { index: others[3], column: 2, row: 1, columnSpan: 1, rowSpan: 1 },
            ],
        };
    };

    const layoutOnePlusTwoByTwoMobile = (featuredIndex) => {
        const others = [0, 1, 2, 3, 4].filter((index) => index !== featuredIndex).slice(0, 4);
        return {
            columns: 2,
            rows: 3,
            cells: [
                { index: featuredIndex, column: 0, row: 0, columnSpan: 2, rowSpan: 1 },
                { index: others[0], column: 0, row: 1, columnSpan: 1, rowSpan: 1 },
                { index: others[1], column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
                { index: others[2], column: 0, row: 2, columnSpan: 1, rowSpan: 1 },
                { index: others[3], column: 1, row: 2, columnSpan: 1, rowSpan: 1 },
            ],
        };
    };

    const planTileLayout = (count, options = {}) => {
        const isMobile = window.innerWidth < DESKTOP_MEDIA_MIN;
        const pattern = options.pattern;
        const featuredIndex = Number.isFinite(options.featuredIndex) ? options.featuredIndex : 0;

        if (pattern === "one-plus-2x2" && count === 5) {
            return isMobile ? layoutOnePlusTwoByTwoMobile(featuredIndex) : layoutOnePlusTwoByTwo(featuredIndex);
        }

        if (pattern === "row-3" && count === 3) {
            return layoutRow3();
        }

        if ((pattern === "hero-details" || pattern === "device-hero") && count === 3) {
            return isMobile ? layoutHeroDetailsMobile() : layoutHeroDetails();
        }

        if (pattern === "product-context" && count === 3) {
            return isMobile ? layoutProductContextMobile() : layoutProductContext();
        }

        if (count === 3) {
            return isMobile ? layoutHeroDetailsMobile() : layoutHeroDetails();
        }

        if (count === 5) {
            return isMobile ? layoutOnePlusTwoByTwoMobile(0) : layoutOnePlusTwoByTwo(0);
        }

        return layoutHeroDetails();
    };

    const equalColumnWidths = (columns, width, gap) => {
        const columnWidth = (width - gap * (columns - 1)) / columns;
        return Array.from({ length: columns }, () => columnWidth);
    };

    const wantsSquareHeroWindow = (image, ratio) => {
        if (!image) {
            return false;
        }
        if (image.dataset.tileHeroShape === "square" || image.dataset.mediaKind === "photo") {
            return true;
        }
        return ratio >= 0.85;
    };

    const resolveColumnWidths = (plan, width, gap, ratios, images, pattern) => {
        const isMobile = window.innerWidth < DESKTOP_MEDIA_MIN;
        const heroPattern = pattern === "hero-details" || pattern === "device-hero";
        if (
            heroPattern &&
            !isMobile &&
            plan.columns === 2 &&
            ratios.length >= 3 &&
            wantsSquareHeroWindow(images[0], ratios[0] ?? DEFAULT_PHONE_RATIO)
        ) {
            const targetLeftAspect = 1;
            const detailA = ratios[1] ?? DEFAULT_PHONE_RATIO;
            const detailB = ratios[2] ?? DEFAULT_PHONE_RATIO;
            const denom = 1 + targetLeftAspect / detailA + targetLeftAspect / detailB;
            const rightWidth = (width - gap * (1 + targetLeftAspect)) / denom;
            const mosaicHeight = rightWidth / detailA + gap + rightWidth / detailB;
            const leftWidth = targetLeftAspect * mosaicHeight;
            if (rightWidth >= 96 && leftWidth >= 96 && leftWidth + gap + rightWidth <= width + 2) {
                return [leftWidth, rightWidth];
            }
            const usable = width - gap;
            return [(usable * 1.7) / 2.7, usable / 2.7];
        }
        return equalColumnWidths(plan.columns, width, gap);
    };

    const measureRowHeights = (plan, ratios, columnWidths, gap) => {
        const rowHeights = Array.from({ length: plan.rows }, () => 0);
        for (const cell of plan.cells) {
            const ratio = ratios[cell.index] ?? DEFAULT_PHONE_RATIO;
            let cellWidth = 0;
            for (let column = cell.column; column < cell.column + cell.columnSpan; column += 1) {
                cellWidth += columnWidths[column] ?? 0;
            }
            cellWidth += gap * Math.max(0, cell.columnSpan - 1);
            const cellHeight = cellWidth / ratio;
            const rowShare = cellHeight / cell.rowSpan;
            for (let row = cell.row; row < cell.row + cell.rowSpan; row += 1) {
                rowHeights[row] = Math.max(rowHeights[row], rowShare);
            }
        }
        return rowHeights;
    };

    const estimatePlanHeight = (plan, ratios, width, images, pattern) => {
        const gap = TILE_GAP;
        const columnWidths = resolveColumnWidths(plan, width, gap, ratios, images, pattern);
        const rowHeights = measureRowHeights(plan, ratios, columnWidths, gap);
        return rowHeights.reduce((sum, height) => sum + height, 0) + gap * (plan.rows - 1);
    };

    const objectPositionForImage = (image) => {
        if (image.dataset.mediaKind === "photo") {
            return "center center";
        }
        return "center top";
    };

    const applyTileLayout = (container) => {
        const images = [...container.querySelectorAll("img")];
        if (images.length === 0) {
            return;
        }

        const pattern = container.dataset.tilePattern;
        const featuredRaw = Number(container.dataset.tileFeatured);
        const plan = planTileLayout(images.length, {
            pattern,
            featuredIndex: Number.isFinite(featuredRaw) ? featuredRaw : 0,
        });
        const ratios = images.map((img) => getImageRatio(img));
        const gap = TILE_GAP;

        container.classList.add("case-study__media--tiled");
        container.classList.remove("case-study__media--watch");
        container.style.display = "grid";
        container.style.gap = `${gap}px`;
        container.style.gridTemplateRows = "";
        container.style.width = "100%";
        container.style.maxWidth = "100%";
        container.style.height = "auto";
        container.style.aspectRatio = "";
        container.style.justifySelf = "center";

        for (const image of images) {
            image.style.gridColumn = "";
            image.style.gridRow = "";
            image.style.aspectRatio = "";
            image.style.height = "";
            image.style.width = "";
            image.style.objectFit = "";
            image.style.objectPosition = "";
            image.classList.remove("case-study__media--watch-tall");
        }

        for (const cell of plan.cells) {
            const image = images[cell.index];
            if (!image) {
                continue;
            }
            image.style.gridColumn = `${cell.column + 1} / span ${cell.columnSpan}`;
            image.style.gridRow = `${cell.row + 1} / span ${cell.rowSpan}`;
        }

        const availableWidth = Math.max(160, container.getBoundingClientRect().width || container.clientWidth);
        const study = container.closest(".case-study--media");
        const copy = study?.querySelector(".case-study__copy");
        const naturalHeight = estimatePlanHeight(plan, ratios, availableWidth, images, pattern);
        if (naturalHeight <= 0) {
            return;
        }

        let targetWidth = availableWidth;
        const isDesktop = Boolean(copy) && window.innerWidth >= DESKTOP_MEDIA_MIN;
        if (isDesktop) {
            const copyHeight = copy.offsetHeight;
            if (copyHeight > 0 && naturalHeight > copyHeight) {
                targetWidth = Math.max(160, availableWidth * (copyHeight / naturalHeight));
            }
        }

        const columnWidths = resolveColumnWidths(plan, targetWidth, gap, ratios, images, pattern);
        const rowHeights = measureRowHeights(plan, ratios, columnWidths, gap);
        const mosaicHeight = rowHeights.reduce((sum, height) => sum + height, 0) + gap * Math.max(0, plan.rows - 1);

        container.style.gridTemplateColumns = columnWidths.map((width) => `${Math.max(1, width)}px`).join(" ");
        container.style.width = targetWidth >= availableWidth - 1 ? "100%" : `${Math.floor(targetWidth)}px`;
        container.style.maxWidth = "100%";
        container.style.height = `${Math.ceil(mosaicHeight)}px`;
        container.style.gridTemplateRows = rowHeights.map((height) => `${Math.max(1, height)}px`).join(" ");

        for (const cell of plan.cells) {
            const image = images[cell.index];
            if (!image) {
                continue;
            }
            const ratio = ratios[cell.index] ?? DEFAULT_PHONE_RATIO;
            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";
            image.style.objectPosition = objectPositionForImage(image);
            image.style.aspectRatio = `${ratio}`;
            image.tabIndex = 0;
            image.setAttribute("role", "button");
            image.setAttribute("aria-label", `Open ${image.alt || "image"} fullscreen`);
        }
    };

    const layoutProjectMediaTiles = () => {
        for (const container of document.querySelectorAll(".case-study__media[data-tile-pattern]")) {
            applyTileLayout(container);
        }
    };

    const createLightbox = () => {
        const dialog = document.createElement("dialog");
        dialog.className = "media-lightbox";
        dialog.setAttribute("aria-label", "Fullscreen image");
        dialog.innerHTML = `
            <div class="media-lightbox__frame">
                <button type="button" class="media-lightbox__close" aria-label="Close">Close</button>
                <button type="button" class="media-lightbox__nav media-lightbox__nav--prev" aria-label="Previous image">Prev</button>
                <img class="media-lightbox__image" alt="">
                <button type="button" class="media-lightbox__nav media-lightbox__nav--next" aria-label="Next image">Next</button>
            </div>
        `;
        document.body.appendChild(dialog);

        const imageEl = dialog.querySelector(".media-lightbox__image");
        const closeBtn = dialog.querySelector(".media-lightbox__close");
        const prevBtn = dialog.querySelector(".media-lightbox__nav--prev");
        const nextBtn = dialog.querySelector(".media-lightbox__nav--next");

        let gallery = [];
        let index = 0;
        let trigger = null;

        const render = () => {
            const current = gallery[index];
            if (!current || !imageEl) {
                return;
            }
            imageEl.src = current.currentSrc || current.src;
            imageEl.alt = current.alt || "";
            const multi = gallery.length > 1;
            prevBtn.hidden = !multi;
            nextBtn.hidden = !multi;
        };

        const open = (images, startIndex, from) => {
            gallery = images;
            index = startIndex;
            trigger = from;
            render();
            if (typeof dialog.showModal === "function") {
                dialog.showModal();
            } else {
                dialog.setAttribute("open", "");
            }
            closeBtn.focus();
        };

        const close = () => {
            if (typeof dialog.close === "function") {
                dialog.close();
            } else {
                dialog.removeAttribute("open");
            }
            if (trigger && typeof trigger.focus === "function") {
                trigger.focus();
            }
            trigger = null;
        };

        const step = (delta) => {
            if (gallery.length < 2) {
                return;
            }
            index = (index + delta + gallery.length) % gallery.length;
            render();
        };

        closeBtn.addEventListener("click", close);
        prevBtn.addEventListener("click", () => step(-1));
        nextBtn.addEventListener("click", () => step(1));

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                close();
            }
        });

        dialog.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                step(-1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                step(1);
            }
        });

        return { open };
    };

    const lightbox = createLightbox();

    const bindLightbox = () => {
        for (const container of document.querySelectorAll(".case-study__media")) {
            const images = [...container.querySelectorAll("img")];
            for (const [imageIndex, image] of images.entries()) {
                if (image.dataset.lightboxBound) {
                    continue;
                }
                image.dataset.lightboxBound = "1";
                image.tabIndex = 0;
                image.setAttribute("role", "button");
                if (!image.getAttribute("aria-label")) {
                    image.setAttribute("aria-label", `Open ${image.alt || "image"} fullscreen`);
                }

                const openFrom = () => lightbox.open(images, imageIndex, image);
                image.addEventListener("click", openFrom);
                image.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openFrom();
                    }
                });
            }
        }
    };

    const scheduleLayout = () => {
        window.requestAnimationFrame(() => {
            layoutExperienceTimeline();
            layoutProjectMediaTiles();
            bindLightbox();
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

    for (const study of document.querySelectorAll(".case-study--media")) {
        if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(scheduleLayout).observe(study);
        }
        for (const image of study.querySelectorAll(".case-study__media img")) {
            if (!image.complete) {
                image.addEventListener("load", scheduleLayout, { once: true });
            }
        }
    }

    const copyBlocks = document.querySelectorAll(".case-study--media .case-study__copy");
    if (typeof ResizeObserver !== "undefined") {
        for (const copy of copyBlocks) {
            new ResizeObserver(scheduleLayout).observe(copy);
        }
    }
})();
