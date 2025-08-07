export function setupScrollingAnimation() {
    const scrollContainer = document.getElementById("main-scrolling-content");
    scrollContainer.addEventListener("scroll", handleScroll);
    window.scrollContainers = new ScrollContainerData(
        scrollContainer,
        document.querySelector(".home-link"),
        document.querySelector(".projects-link"),
        document.querySelector(".about-me-link")
    );
}

export function teardownScrollingAnimation() {
    const scrollContainer = document.getElementById("main-scrolling-content");
    scrollContainer.removeEventListener("scroll", handleScroll);
    window.ScrollContainers = {};
}

class ScrollContainerData {
    static activeClassName = "current";
    container;
    homeLink;
    projectsLink;
    aboutMeLink;

    /**
     * 
     * @param {HTMLElement} container
     * @param {HTMLElement} homeLink
     * @param {HTMLElement} projectsLink
     * @param {HTMLElement} aboutMeLink
     */
    constructor(container, homeLink, projectsLink, aboutMeLink) {
        this.container = container;
        this.homeLink = homeLink;
        this.projectsLink = projectsLink;
        this.aboutMeLink = aboutMeLink;
    }
}

/**
 * 
 * @param {Event} event
 */
function handleScroll(event) {
    /** @type {ScrollContainerData} */
    let data = window.scrollContainers;
    if (data === null || !(data instanceof ScrollContainerData) || data.container === null) return;

    const mainScrollContainer = data.container;
    const scrollableHeight = mainScrollContainer.scrollHeight - mainScrollContainer.clientHeight;
    if (scrollableHeight > 0) {
        let scrollPercentage = (mainScrollContainer.scrollTop / scrollableHeight) * 100;
        if (isBetween(0, 33, scrollPercentage)) {
            data.homeLink.classList.add(ScrollContainerData.activeClassName);
            data.projectsLink.classList.remove(ScrollContainerData.activeClassName);
            data.aboutMeLink.classList.remove(ScrollContainerData.activeClassName);
        }
        else if (isBetween(33, 66, scrollPercentage)) {
            data.homeLink.classList.remove(ScrollContainerData.activeClassName);
            data.projectsLink.classList.add(ScrollContainerData.activeClassName);
            data.aboutMeLink.classList.remove(ScrollContainerData.activeClassName);
        }
        else {
            data.homeLink.classList.remove(ScrollContainerData.activeClassName);
            data.projectsLink.classList.remove(ScrollContainerData.activeClassName);
            data.aboutMeLink.classList.add(ScrollContainerData.activeClassName);
        }
    }
}

/**
 * 
 * @param {number} min
 * @param {number} max
 * @param {number} num
 * @returns {boolean}
 */
function isBetween(min, max, num) {
    return num >= min && num <= max;
}