export function setup() {
    const scrollContainer = document.getElementById("main-scrolling-content");
    scrollContainer.addEventListener("scroll", handleScroll);
    window.scrollContainers = new ScrollContainerData(
        scrollContainer,
        document.querySelectorAll(".home-link"),
        document.querySelectorAll(".projects-link"),
        document.querySelectorAll(".about-me-link")
    );
    window.downloadFileFromStream = downloadFileFromStream;
}

export function dispose() {
    const scrollContainer = document.getElementById("main-scrolling-content");
    scrollContainer.removeEventListener("scroll", handleScroll);
    window.scrollContainers = null;
    window.downloadFileFromStream = null;
}

class ScrollContainerData {
    static #activeClass = "current";
    static #scrollBehavior = {
        behavior: 'smooth',
        block: 'nearest'
    }
    static #bodyGridSizeProperty = "--grid-box-size";
    body;
    container;
    homeLinks;
    projectsLinks;
    aboutMeLinks;

    /**
     * @param {HTMLElement} container
     * @param {NodeListOf<Element>} homeLinks
     * @param {NodeListOf<Element>} projectsLinks
     * @param {NodeListOf<Element>} aboutMeLinks
     */
    constructor(container, homeLinks, projectsLinks, aboutMeLinks) {
        this.body = document.getElementsByTagName("body")[0];
        this.container = container;
        this.homeLinks = homeLinks;
        this.projectsLinks = projectsLinks;
        this.aboutMeLinks = aboutMeLinks;
    }

    setHomeLinksToActive() {
        this.addClassToElements(this.homeLinks, ScrollContainerData.#activeClass);
        this.removeClassFromElements(this.projectsLinks, ScrollContainerData.#activeClass);
        this.removeClassFromElements(this.aboutMeLinks, ScrollContainerData.#activeClass);
    }

    setProjectsLinksToActive() {
        this.removeClassFromElements(this.homeLinks, ScrollContainerData.#activeClass);
        this.addClassToElements(this.projectsLinks, ScrollContainerData.#activeClass);
        this.removeClassFromElements(this.aboutMeLinks, ScrollContainerData.#activeClass);
    }

    setAboutMeLinksToActive() {
        this.removeClassFromElements(this.homeLinks, ScrollContainerData.#activeClass);
        this.removeClassFromElements(this.projectsLinks, ScrollContainerData.#activeClass);
        this.addClassToElements(this.aboutMeLinks, ScrollContainerData.#activeClass);
    }

    /**
     * @param {number} value
     */
    setBodyGridSize(value) {
        var mapped = map(0, 100, 2, 4, value);
        this.body.style.setProperty(ScrollContainerData.#bodyGridSizeProperty, `max(${mapped}dvw, 8px)`);
    }

    /**
     * @param {NodeListOf<Element>} elements
     * @param {string} className
     */
    addClassToElements(elements, className) {
        elements.forEach(element => {
            if (ScrollContainerData.isValidHtmlElement(element)) {
                element.classList.add(className);
                element.scrollIntoView(ScrollContainerData.#scrollBehavior);
            }
        });
    }

    /**
     * @param {NodeListOf<Element>} elements
     * @param {string} className
     */
    removeClassFromElements(elements, className) {
        elements.forEach(element => {
            if (ScrollContainerData.isValidHtmlElement(element)) {
                element.classList.remove(className);
            }
        });
    }

    /**
     * @param {any} element
     * @returns {boolean}
     */
    static isValidHtmlElement(element) {
        return element !== null && element instanceof HTMLElement;
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
        data.setBodyGridSize(scrollPercentage);
        if (isBetween(0, 33, scrollPercentage)) {
            data.setHomeLinksToActive();            
        }
        else if (isBetween(33, 66, scrollPercentage)) {
            data.setProjectsLinksToActive();
        }
        else {
            data.setAboutMeLinksToActive();
        }
    }
}

/**
 * @param {number} min
 * @param {number} max
 * @param {number} num
 * @returns {boolean}
 */
function isBetween(min, max, num) {
    return num >= min && num <= max;
}

/**
 * @param {number} inputMin
 * @param {number} inputMax
 * @param {number} outputMin
 * @param {number} outputMax
 * @param {number} value
 */
function map(inputMin, inputMax, outputMin, outputMax, value) {
    return outputMin + ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin);
}

async function downloadFileFromStream(fileName, contentStreamRef) {
    /** @type {ArrayBuffer} */
    const arrayBuffer = await contentStreamRef.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.download = fileName ?? '';
    anchorElement.click();
    anchorElement.remove();
    URL.revokeObjectURL(url);
}