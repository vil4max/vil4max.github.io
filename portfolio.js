(() => {
    const roadmap = document.querySelector("[data-career-roadmap]");
    const stack = document.querySelector("[data-milestone-stack]");
    if (!roadmap) {
        return;
    }

    const nodes = [...roadmap.querySelectorAll("[data-milestone]")];
    const panels = stack ? [...stack.querySelectorAll("[data-milestone-panel]")] : [];
    const storyIds = new Set(panels.map((panel) => panel.getAttribute("data-milestone-panel")));

    function activate(id) {
        for (const node of nodes) {
            const active = node.getAttribute("data-milestone") === id;
            node.setAttribute("aria-pressed", active ? "true" : "false");
            node.closest(".career-path__item")?.classList.toggle("is-active", active);
        }

        const scrollTarget = nodes
            .find((node) => node.getAttribute("data-milestone") === id)
            ?.getAttribute("data-scroll-target");

        if (scrollTarget) {
            for (const panel of panels) {
                panel.hidden = true;
            }
            document.getElementById(scrollTarget)?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "start",
            });
            return;
        }

        for (const panel of panels) {
            const match = panel.getAttribute("data-milestone-panel") === id;
            panel.hidden = storyIds.has(id) ? !match : true;
        }
    }

    function indexOf(id) {
        return nodes.findIndex((node) => node.getAttribute("data-milestone") === id);
    }

    function activateByOffset(currentId, delta) {
        const current = indexOf(currentId);
        if (current < 0) {
            return;
        }
        const next = Math.max(0, Math.min(nodes.length - 1, current + delta));
        const target = nodes[next];
        activate(target.getAttribute("data-milestone"));
        target.focus();
    }

    for (const node of nodes) {
        node.addEventListener("click", () => {
            activate(node.getAttribute("data-milestone"));
        });
        node.addEventListener("keydown", (event) => {
            const id = node.getAttribute("data-milestone");
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                activateByOffset(id, 1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                activateByOffset(id, -1);
            } else if (event.key === "Home") {
                event.preventDefault();
                activate(nodes[0].getAttribute("data-milestone"));
                nodes[0].focus();
            } else if (event.key === "End") {
                event.preventDefault();
                const last = nodes[nodes.length - 1];
                activate(last.getAttribute("data-milestone"));
                last.focus();
            }
        });
    }

    const initial =
        nodes.find((node) => node.getAttribute("aria-pressed") === "true") ||
        nodes.find((node) => node.getAttribute("data-milestone") === "globallogic") ||
        nodes[0];
    if (initial) {
        activate(initial.getAttribute("data-milestone"));
    }
})();
