(() => {
    const roadmap = document.querySelector("[data-career-roadmap]");
    if (!roadmap) {
        return;
    }

    const nodes = [...roadmap.querySelectorAll("[data-milestone]")];

    function activate(id, { scroll = true } = {}) {
        for (const node of nodes) {
            const active = node.getAttribute("data-milestone") === id;
            node.setAttribute("aria-pressed", active ? "true" : "false");
            node.closest(".career-path__item")?.classList.toggle("is-active", active);
        }

        if (!scroll) {
            return;
        }

        const scrollTarget = nodes
            .find((node) => node.getAttribute("data-milestone") === id)
            ?.getAttribute("data-scroll-target");
        if (!scrollTarget) {
            return;
        }

        document.getElementById(scrollTarget)?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start",
        });
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
        activate(initial.getAttribute("data-milestone"), { scroll: false });
    }
})();
