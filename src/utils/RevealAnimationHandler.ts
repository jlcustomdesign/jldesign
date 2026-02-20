/**
	The Reveal Animator

	This script handles revealing text elements with data-reveal attributes
	when they become visible in the viewport using GSAP animations.
	All styling is included inline and no external CSS is required.
	
	### TEXT REVEAL TYPES:
	data-reveal="perspective" - Animates text with a 3D perspective effect
	data-reveal="slide" - Animates text line by line with a reveal effect
    data-reveal="block" - Animates the entire element as a block (fade up) without splitting text. Ideal for images, cards, buttons.

	### Text Reveal Properties
	data-reveal-fade - Add opacity animation (boolean attribute)
	data-reveal-blur - Add blur and opacity animation (boolean attribute)
	data-reveal-duration="0.75" - Duration of animation in seconds (default: 0.75)
	data-reveal-delay="0.1" - Delay before animation starts in seconds (default: 0.1)
	data-reveal-stagger="0.1" - Stagger time between animated elements (default: varies by animation type)
	data-reveal-keep-will-change - If present, keeps will-change: transform after animation (default: false)

	 */

import { gsap } from 'gsap';

// Default animation values
const DEFAULT_ANIMATION_VALUES = {
	DURATION: 0.75,
	DELAY: 0,
	STAGGER: 0.1,
};

// Mobile detection - disable expensive effects on mobile for performance
const IS_MOBILE = typeof window !== 'undefined' && 
	(window.innerWidth < 1024 || 'ontouchstart' in window);

// Common selectors used throughout the code
const SELECTORS = {
	NESTED_TEXT_ELEMENTS: 'h1, h2, h3, h4, h5, h6, p, li',
	SPLIT_WORD: '.split-word',
};

interface AnimationOptions {
	duration?: number;
	delay?: number;
	stagger?: number;
	fade?: boolean;
	blur?: boolean;
	keepWillChange?: boolean;
}

const ACCESSIBILITY = {
	SR_ONLY_CLASS: 'sr-only',
	SR_ONLY_STYLE:
		'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0;',
};

/**
 * Standardize animation options by applying defaults
 * Note: blur is disabled on mobile devices for performance
 */
const standardizeOptions = (element: HTMLElement): AnimationOptions => {
	return {
		duration: getAttributeValue(
			element,
			'data-reveal-duration',
			DEFAULT_ANIMATION_VALUES.DURATION
		),
		delay: getAttributeValue(
			element,
			'data-reveal-delay',
			DEFAULT_ANIMATION_VALUES.DELAY
		),
		stagger: getAttributeValue(
			element,
			'data-reveal-stagger',
			// Faster stagger on mobile for better perceived performance
			IS_MOBILE ? DEFAULT_ANIMATION_VALUES.STAGGER * 0.5 : DEFAULT_ANIMATION_VALUES.STAGGER
		),
		fade: element.hasAttribute('data-reveal-fade'),
		// CRITICAL: Disable blur on mobile - it's the most expensive CSS filter
		blur: IS_MOBILE ? false : element.hasAttribute('data-reveal-blur'),
		keepWillChange: element.hasAttribute('data-reveal-keep-will-change'),
	};
};

/**
 * Initializes animations by finding elements with data-reveal attribute
 * and setting up intersection observers.
 * Returns a cleanup function.
 */
export const initTextAnimations = (scope: Document | HTMLElement = document): (() => void) => {
	// Store animated elements locally for this instance
    const localAnimatedElements: HTMLElement[] = [];
    let resizeTimeout: number | null = null;

    /**
     * Handles intersection events for animated elements
     */
    const handleIntersection = (
        entries: IntersectionObserverEntry[],
        obs: IntersectionObserver
    ): void => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target as HTMLElement;
                const animType = element.getAttribute('data-reveal');

                // Stop observing once animation is triggered
                obs.unobserve(element);

                // Get animation options
                const options = standardizeOptions(element);

                // Detect if this element acts as a container for multiple text nodes
                const nestedTextElements = Array.from(
                    element.querySelectorAll<HTMLElement>(SELECTORS.NESTED_TEXT_ELEMENTS)
                );

                // Whether the element contains nested text elements to treat as a grouped container
                const hasNestedElements = nestedTextElements.length > 0;

                // Trigger appropriate animation based on data-reveal value
                switch (animType) {
                    case 'perspective':
                        if (hasNestedElements) {
                            animateGroupedPerspective(element, nestedTextElements, options);
                        } else {
                            animatePerspective(element, options);
                        }
                        break;
                    case 'slide':
                        if (hasNestedElements) {
                            animateGroupedSlide(element, nestedTextElements, options);
                        } else {
                            animateSlide(element, options);
                        }
                        break;
                    case 'word-slide':
                        animateWordSlide(element, options);
                        break;
                    case 'block':
                        animateBlock(element, options);
                        break;
                    default:
                        // Default to object animation for any unspecified animation type
                        animateSlide(element, options);
                }
            }
        });
    };

	// Initialize the observer
	const observer = new IntersectionObserver(
		(entries) => handleIntersection(entries, observer),
		{
			root: null,
			// Trigger slightly before it enters the viewport (50px) to prevent visible delay
			rootMargin: '0px 0px 50px 0px', 
			// Trigger as soon as 1 pixel (0%) is visible, rather than waiting for 10%
			threshold: 0,
		}
	);

	// Find all elements with data-reveal attribute within scope
	const elements = scope.querySelectorAll('[data-reveal]');

	elements.forEach((element) => {
		const htmlElement = element as HTMLElement;

        // SKIP if already initialized to prevent double-binding/splitting
        if (htmlElement.getAttribute('data-reveal-initialized') === 'true') {
            return;
        }

        // Mark as initialized immediately
        htmlElement.setAttribute('data-reveal-initialized', 'true');

        const animType = htmlElement.getAttribute('data-reveal');

		// Store original text content ONLY for split-text types
        if (['slide', 'perspective', 'word-slide'].includes(animType || '')) {
             if(!(htmlElement as any).originalText) {
                (htmlElement as any).originalText = htmlElement.innerHTML;
            }
        }

		// Set initial opacity to 0 directly if it's not already set
		if (htmlElement.style.opacity !== '0') {
			htmlElement.style.opacity = '0';
		}

		// Add to animated elements array
		localAnimatedElements.push(htmlElement);

		// Start observing the element
		observer.observe(htmlElement);
	});
    
    /**
     * Restores an element to its original text form
     */
    const restoreOriginalText = (element: HTMLElement): void => {
        // Skip if element doesn't have originalText property
        if (!(element as any).originalText) return;

        // Get computed style of the element
        const computedStyle = window.getComputedStyle(element);
        const originalStyle = {
            opacity: computedStyle.opacity,
        };

        // Restore original HTML
        element.innerHTML = (element as any).originalText;

        // Ensure the sr-only span is present after restoring
        insertSrOnlyText(element);

        // Apply any styling that might have been applied during animation
        if (originalStyle.opacity !== '0') {
            element.style.opacity = originalStyle.opacity;
        }

        // If this element acts as a container for grouped line reveal, ensure nested text elements are visible
        if (
            ['slide', 'perspective', 'word-slide'].includes(element.getAttribute('data-reveal') || '')
        ) {
            const nestedTextEls = element.querySelectorAll<HTMLElement>(
                SELECTORS.NESTED_TEXT_ELEMENTS
            );
            nestedTextEls.forEach((nested) => {
                // Only override opacity if not explicitly set from CSS elsewhere
                nested.style.opacity = '1';
            });
        }

        // Clear any transform properties
        element.style.transform = 'none';
        element.style.transformOrigin = '';
        element.style.willChange = 'auto';

        // Remove any 3D transform properties if they exist
        element.style.perspective = '';
        element.style.transformStyle = '';
    };

    /**
     * Handles window resize events
     */
    const handleWindowResize = (): void => {
        if (resizeTimeout !== null) {
            window.clearTimeout(resizeTimeout);
        }

        resizeTimeout = window.setTimeout(() => {
            // Process only text-based animated elements
            localAnimatedElements.forEach((element) => {
                const animType = element.getAttribute('data-reveal');
                if (animType && ['slide', 'perspective', 'word-slide'].includes(animType)) {
                     if(document.body.contains(element)) {
                        restoreOriginalText(element);
                         element.style.opacity = '1';
                    }
                }
            });
        }, 100);
    };

	// Add window resize event listener
	window.addEventListener('resize', handleWindowResize);

    // Return Cleanup Function
    return () => {
        window.removeEventListener('resize', handleWindowResize);
        observer.disconnect();
        if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
    };
};

/**
 * Get numeric attribute value with fallback
 */
const getAttributeValue = (
	element: HTMLElement,
	attr: string,
	defaultValue: number
): number => {
	const value = element.getAttribute(attr);
	return value ? parseFloat(value) : defaultValue;
};

/**
 * Generate HTML for line-based animations
 */
const generateLinesHTML = (
	lines: string[],
	useOverflowHidden: boolean,
	use3D: boolean = false
): string => {
	return lines
		.map((line) => {
			const divStyles = use3D
				? `display: block; transform-origin: 50% 0; transform-style: preserve-3d; overflow: ${
						!useOverflowHidden ? 'visible' : 'hidden'
				  };`
				: `display: block; overflow: ${
						!useOverflowHidden ? 'visible' : 'hidden'
				  }; will-change: transform;`;

			const spanStyles = use3D
				? `display: inline-block; transform: translateY(100%); transform-origin: 50% 0; will-change: transform;`
				: `display: inline-block; transform: translateY(100%); will-change: transform;`;

			return `<div style="${divStyles}">
						<span style="${spanStyles}">
							${line}
						</span>
					</div>`;
		})
		.join('');
};

/**
 * Helper: apply minimal inline style after animation is done
 */
const applyCleanStyles = (
	node: HTMLElement,
	isSpan: boolean,
	keepWillChange: boolean
): void => {
	const base = `${
		isSpan ? 'display: inline-block;' : 'display: block;'
	} opacity: 1;`;
	node.style.cssText = keepWillChange
		? `${base} will-change: transform;`
		: base;
};

/**
 * Animate entire block element (Simple Fade Up)
 */
const animateBlock = (
    element: HTMLElement,
    options: AnimationOptions
): void => {
    // Ensure initial state
    element.style.opacity = '0';
    
    // We do NOT modify innerHTML or split text here.
    // Pure GSAP Fade Up
     gsap.fromTo(
        element,
        { 
            y: 30, 
            opacity: 0,
            filter: options.blur ? 'blur(10px)' : 'blur(0px)'
        },
        {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
            delay: options.delay || 0,
            ease: 'power2.out',
            onComplete: () => {
                element.style.transform = '';
                element.style.opacity = '1';
                element.style.filter = '';
                if(!options.keepWillChange) {
                    element.style.willChange = 'auto';
                }
            }
        }
    );
};

// ... [Existing split logic helpers below] ... 

/**
 * Split text into lines by wrapping words in spans and checking offsetTop
 */
const splitTextIntoLines = (element: HTMLElement): string[] => {
	const originalHTML = element.innerHTML;
	const { parentClone, elementClone } = createAnalysisClone(element);
	if (!parentClone) return [originalHTML];

	splitWordsInElement(elementClone);

	const words = Array.from(elementClone.querySelectorAll('.split-word'));
	if (words.length === 0) {
		document.body.removeChild(parentClone);
		return [originalHTML];
	}

	const lines: string[] = [];
	let currentLine: string[] = [];
	let currentTop = (words[0] as HTMLElement).offsetTop;

	words.forEach((word) => {
		const htmlWord = word as HTMLElement;
		if (htmlWord.offsetTop > currentTop) {
			lines.push(currentLine.join(' '));
			currentLine = [];
			currentTop = htmlWord.offsetTop;
		}
		currentLine.push(htmlWord.innerText); // using innerText to keep it clean
	});
	lines.push(currentLine.join(' '));

	document.body.removeChild(parentClone);
	return lines;
};

/**
 * Split words in element recursively
 */
const splitWordsInElement = (element: Element): void => {
	Array.from(element.childNodes).forEach((node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent?.trim();
			if (text && text.length > 0) {
				const words = text.split(/\s+/);
				const fragment = document.createDocumentFragment();
				words.forEach((word, index) => {
					const span = document.createElement('span');
					span.textContent = word;
					span.className = 'split-word';
					span.style.display = 'inline-block';
					fragment.appendChild(span);
					if (index < words.length - 1) {
						fragment.appendChild(document.createTextNode(' '));
					}
				});
				node.parentNode?.replaceChild(fragment, node);
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			splitWordsInElement(node as Element);
		}
	});
};

/**
 * Create a clone of the element for analysis
 */
const createAnalysisClone = (
	element: HTMLElement
): { parentClone: HTMLElement | null; elementClone: HTMLElement } => {
	const parent = element.parentElement;
	if (!parent) return { parentClone: null, elementClone: element };

	const parentClone = parent.cloneNode(false) as HTMLElement;
	parentClone.style.position = 'absolute';
	parentClone.style.top = '-9999px';
	parentClone.style.left = '-9999px';
	parentClone.style.visibility = 'hidden';
	parentClone.style.width = getComputedStyle(parent).width;
    parentClone.style.height = 'auto'; // ensure height adapts

	const elementClone = element.cloneNode(true) as HTMLElement;
    // Ensure element clone has same display properties
    const computedStyle = getComputedStyle(element);
    elementClone.style.display = computedStyle.display;
    elementClone.style.flexDirection = computedStyle.flexDirection;
    elementClone.style.alignItems = computedStyle.alignItems;
    elementClone.style.justifyContent = computedStyle.justifyContent;
    elementClone.style.gap = computedStyle.gap;

	parentClone.appendChild(elementClone);
	document.body.appendChild(parentClone);

	return { parentClone, elementClone };
};

/**
 * Animate text with perspective style (3D effect)
 */
const animatePerspective = (
	element: HTMLElement,
	options: AnimationOptions
): void => {
	element.style.opacity = '1';
	const lines = splitTextIntoLines(element);
	const container = document.createElement('div');
	container.style.perspective = '1000px';
	container.setAttribute('aria-hidden', 'true');
	const linesHTML = generateLinesHTML(
		lines,
		!(options.fade || options.blur),
		true
	);
	container.innerHTML = linesHTML;
	element.innerHTML = '';
	insertSrOnlyText(element);
	element.appendChild(container);
	const lineElements = container.querySelectorAll('div');
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});
	lineElements.forEach((lineElement, lineIndex) => {
		const lineSpan = lineElement.querySelector('span');
		const lineDelay =
			lineIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);
		const keepWillChange = options.keepWillChange || false;

		if (options.blur) {
			timeline.fromTo(
				lineSpan,
				{ y: '300%' },
				{
					y: 0,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					onComplete: () => {
						applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
					},
				},
				lineDelay
			);
			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
					opacity: 0,
					filter: 'blur(25px)',
				},
				{
					rotateX: '0deg',
					rotateY: '0deg',
					z: '0rem',
					opacity: 1,
					filter: 'blur(0px)',
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quad.out',
					onComplete: () => {
						applyCleanStyles(lineElement as HTMLElement, false, keepWillChange);
					},
				},
				lineDelay
			);
		} else if (options.fade) {
			timeline.fromTo(
				lineSpan,
				{ y: '300%', opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					onComplete: () => {
						applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
					},
				},
				lineDelay
			);
			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
				},
				{
					rotateX: '0deg',
					rotateY: '0deg',
					z: '0rem',
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quad.out',
					onComplete: () => {
						applyCleanStyles(lineElement as HTMLElement, false, keepWillChange);
					},
				},
				lineDelay
			);
		} else {
			timeline.fromTo(
				lineSpan,
				{ y: '300%' },
				{
					y: 0,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					onComplete: () => {
						applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
					},
				},
				lineDelay
			);
			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
				},
				{
					rotateX: '0deg',
					rotateY: '0deg',
					z: '0rem',
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quad.out',
					onComplete: () => {
						applyCleanStyles(lineElement as HTMLElement, false, keepWillChange);
					},
				},
				lineDelay
			);
		}
	});
};

/**
 * Animate a single line element with its containing span
 */
const animateSingleLine = (
	lineElement: Element,
	lineIndex: number,
	totalLines: number,
	timeline: gsap.core.Timeline,
	options: AnimationOptions,
	keepWillChange: boolean
): void => {
	const lineSpan = lineElement.querySelector('span');
	if (!lineSpan) return;

	const lineDelay =
		lineIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);
	const spanDuration = options.duration || DEFAULT_ANIMATION_VALUES.DURATION;
	const lineDuration = spanDuration * 1.5;
	const progressiveOffset =
		totalLines > 1 ? (lineIndex / (totalLines - 1)) * 50 : 0;

	if (options.blur) {
		timeline.fromTo(
			lineSpan,
			{ y: '100%' },
			{
				y: 0,
				duration: spanDuration,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
				},
			},
			lineDelay
		);
		timeline.fromTo(
			lineElement,
			{
				y: `${progressiveOffset}%`,
				opacity: 0,
				filter: 'blur(25px)',
			},
			{
				y: 0,
				opacity: 1,
				filter: 'blur(0px)',
				duration: lineDuration,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineElement as HTMLElement, false, keepWillChange);
				},
			},
			lineDelay
		);
	} else if (options.fade) {
		timeline.fromTo(
			lineSpan,
			{ y: '100%', opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: spanDuration,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
				},
			},
			lineDelay
		);
		timeline.fromTo(
			lineElement,
			{ y: `${progressiveOffset}%`, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: lineDuration,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineElement as HTMLElement, false, keepWillChange);
				},
			},
			lineDelay
		);
	} else {
		timeline.fromTo(
			lineSpan,
			{ y: '100%' },
			{
				y: 0,
				duration: spanDuration,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
				},
			},
			lineDelay
		);
		timeline.fromTo(
			lineElement,
			{ y: `${progressiveOffset}%` },
			{
				y: 0,
				duration: lineDuration,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineElement as HTMLElement, false, keepWillChange);
				},
			},
			lineDelay
		);
	}
};

/**
 * Animate text by sliding lines
 */
const animateSlide = (
	element: HTMLElement,
	options: AnimationOptions
): void => {
	element.style.opacity = '1';
	const lines = splitTextIntoLines(element);
	const container = document.createElement('div');
	container.setAttribute('aria-hidden', 'true');
	const linesHTML = generateLinesHTML(lines, !options.fade);
	container.innerHTML = linesHTML;
	element.innerHTML = '';
	insertSrOnlyText(element);
	element.appendChild(container);
	const lineElements = container.querySelectorAll('div');
	const totalLines = lineElements.length;
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});
	lineElements.forEach((lineElement, lineIndex) => {
		const keepWillChange = options.keepWillChange || false;
		animateSingleLine(
			lineElement,
			lineIndex,
			totalLines,
			timeline,
			options,
			keepWillChange
		);
	});
};

/**
 * Animate text by sliding words individually
 */
const animateWordSlide = (
	element: HTMLElement,
	options: AnimationOptions
): void => {
	element.style.opacity = '1';
	const wordsHTML = splitTextIntoWordsOnly(element);
	const container = document.createElement('div');
    container.style.display = 'block'; 
    container.style.wordWrap = 'break-word';
	container.setAttribute('aria-hidden', 'true');
	container.innerHTML = wordsHTML;
	element.innerHTML = '';
	insertSrOnlyText(element);
	element.appendChild(container);
	const wordWrappers = container.querySelectorAll('.word-wrapper');
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});
	wordWrappers.forEach((wordWrapper, index) => {
		const wordSpan = wordWrapper.querySelector('.word-inner');
        if(!wordSpan) return;
		const wordDelay = index * (options.stagger || 0.03); 
        const duration = options.duration || DEFAULT_ANIMATION_VALUES.DURATION;
        timeline.fromTo(
            wordSpan,
            { y: '100%' },
            {
                y: 0,
                duration: duration,
                ease: 'quart.out',
                onComplete: () => {
                     (wordSpan as HTMLElement).style.transform = '';
                     (wordSpan as HTMLElement).style.willChange = 'auto';
                }
            },
            wordDelay
        );
	});
};

/**
 * Split text into words only
 */
const splitTextIntoWordsOnly = (element: HTMLElement): string => {
	const originalHTML = element.innerHTML;
	const { parentClone, elementClone } = createAnalysisClone(element);
	if (!parentClone) return originalHTML;
	splitWordsInElement(elementClone);
    
    // Recursive function to wrap .split-word elements
    const wrapWordsRecursively = (node: Node): string => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (el.classList.contains('split-word')) {
                const text = el.textContent || '';
                return `<span class="word-wrapper" style="display: inline-block; overflow: hidden; vertical-align: top; margin-right: 0.25em; will-change: transform;"><span class="word-inner" style="display: inline-block; transform: translateY(100%); will-change: transform;">${text}</span></span>`;
            }
            let innerHTML = '';
            el.childNodes.forEach(child => {
                innerHTML += wrapWordsRecursively(child);
            });
            const tagName = el.tagName.toLowerCase();
            let attributes = '';
            Array.from(el.attributes).forEach(attr => {
                 attributes += ` ${attr.name}="${attr.value}"`;
            });
            return `<${tagName}${attributes}>${innerHTML}</${tagName}>`;
        } else if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }
        return '';
    };

    let result = '';
    elementClone.childNodes.forEach(child => {
        result += wrapWordsRecursively(child);
    });

	document.body.removeChild(parentClone);
	return result;
};


/**
 * Inserts a screen-reader only span with the original text
 */
const insertSrOnlyText = (element: HTMLElement): void => {
	const srOnlySpan = document.createElement('span');
	srOnlySpan.className = ACCESSIBILITY.SR_ONLY_CLASS;
	srOnlySpan.style.cssText = ACCESSIBILITY.SR_ONLY_STYLE;
	srOnlySpan.textContent =
		(element as any).originalText || element.innerText || element.textContent;
	element.prepend(srOnlySpan);
};

/**
 * Animate grouped text elements with perspective style
 */
const animateGroupedPerspective = (
	container: HTMLElement,
	elements: HTMLElement[],
	options: AnimationOptions
): void => {
	container.style.opacity = '1';
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});
	let globalDelayIndex = 0;
	elements.forEach((element) => {
		if (!(element as any).originalText) {
			(element as any).originalText = element.innerHTML;
		}
		element.style.opacity = '1';
		const lines = splitTextIntoLines(element);
		const perspectiveContainer = document.createElement('div');
		perspectiveContainer.style.perspective = '1000px';
		perspectiveContainer.setAttribute('aria-hidden', 'true');
		const linesHTML = generateLinesHTML(
			lines,
			!(options.fade || options.blur),
			true
		);
		perspectiveContainer.innerHTML = linesHTML;
		element.innerHTML = '';
		insertSrOnlyText(element);
		element.appendChild(perspectiveContainer);
		const lineElements = perspectiveContainer.querySelectorAll('div');
		lineElements.forEach((lineElement) => {
			const lineSpan = lineElement.querySelector('span');
			const lineDelay =
				globalDelayIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);
			globalDelayIndex++;
			const keepWillChange = options.keepWillChange || false;

			if (options.blur) {
				timeline.fromTo(
					lineSpan,
					{ y: '300%' },
					{
						y: 0,
						duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
						ease: 'quart.out',
						onComplete: () =>
							applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange),
					},
					lineDelay
				);
				timeline.fromTo(
					lineElement,
					{
						rotateX: '-75deg',
						rotateY: '0deg',
						z: '2rem',
						opacity: 0,
                        filter: 'blur(25px)'
					},
					{
						rotateX: '0deg',
						rotateY: '0deg',
						z: '0rem',
						opacity: 1,
                        filter: 'blur(0px)',
						duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
						ease: 'quad.out',
						onComplete: () =>
							applyCleanStyles(lineElement as HTMLElement, false, keepWillChange),
					},
					lineDelay
				);
			} else {
				timeline.fromTo(
					lineSpan,
					{ y: '300%' },
					{
						y: 0,
						duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
						ease: 'quart.out',
						onComplete: () =>
							applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange),
					},
					lineDelay
				);
				timeline.fromTo(
					lineElement,
					{
						rotateX: '-75deg',
						rotateY: '0deg',
						z: '2rem',
					},
					{
						rotateX: '0deg',
						rotateY: '0deg',
						z: '0rem',
						duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
						ease: 'quad.out',
						onComplete: () =>
							applyCleanStyles(lineElement as HTMLElement, false, keepWillChange),
					},
					lineDelay
				);
			}
		});
	});
};

/**
 * Animate grouped text elements with slide style
 */
const animateGroupedSlide = (
	container: HTMLElement,
	elements: HTMLElement[],
	options: AnimationOptions
): void => {
	container.style.opacity = '1';
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});
	let globalDelayIndex = 0;
	elements.forEach((element) => {
		if (!(element as any).originalText) {
			(element as any).originalText = element.innerHTML;
		}
		element.style.opacity = '1';
		const lines = splitTextIntoLines(element);
		const slideContainer = document.createElement('div');
		slideContainer.setAttribute('aria-hidden', 'true');
		const linesHTML = generateLinesHTML(lines, !options.fade);
		slideContainer.innerHTML = linesHTML;
		element.innerHTML = '';
		insertSrOnlyText(element);
		element.appendChild(slideContainer);
		const lineElements = slideContainer.querySelectorAll('div');
		const totalLines = lineElements.length;
		lineElements.forEach((lineElement, lineIndex) => {
			const keepWillChange = options.keepWillChange || false;
			const lineDelay =
				globalDelayIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);
			globalDelayIndex++;
			
			const lineSpan = lineElement.querySelector('span');
			if (!lineSpan) return;

			const spanDuration = options.duration || DEFAULT_ANIMATION_VALUES.DURATION;
			const lineDuration = spanDuration * 1.5;

			if (options.fade) {
				timeline.fromTo(
					lineSpan,
					{ y: '100%', opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: spanDuration,
						ease: 'quart.out',
						onComplete: () => {
							applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
						},
					},
					lineDelay
				);
			} else {
				timeline.fromTo(
					lineSpan,
					{ y: '100%' },
					{
						y: 0,
						duration: spanDuration,
						ease: 'quart.out',
						onComplete: () => {
							applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
						},
					},
					lineDelay
				);
			}
		});
	});
};
