"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";

const xueStrokes = [
  "M 287 710 Q 320 731 353 753 Q 366 766 385 774 Q 401 781 392 795 Q 382 808 362 818 Q 343 828 334 826 Q 324 825 328 815 Q 329 802 282 733 Q 278 729 275 723 C 260 697 262 694 287 710 Z",
  "M 331 479 Q 321 522 314 558 L 309 581 Q 303 611 298 643 L 295 666 Q 292 703 287 710 L 275 723 Q 253 736 228 739 Q 215 742 208 735 Q 202 728 210 715 Q 234 684 248 648 Q 261 612 294 472 C 301 443 338 450 331 479 Z",
  "M 298 643 Q 353 656 395 664 Q 413 668 405 678 Q 396 688 376 691 Q 345 691 295 666 C 268 653 269 636 298 643 Z",
  "M 314 558 Q 365 567 402 575 Q 421 579 413 590 Q 403 600 382 603 Q 357 604 309 581 C 282 568 284 553 314 558 Z",
  "M 525 767 Q 547 800 564 810 Q 570 816 568 825 Q 567 832 550 848 Q 534 861 522 862 Q 510 862 515 848 Q 521 835 490 781 L 475 759 Q 459 737 437 711 Q 431 705 429 701 Q 426 695 435 696 Q 453 696 499 742 L 525 767 Z",
  "M 499 742 Q 554 699 564 696 Q 568 696 572 702 Q 578 709 567 732 Q 560 751 525 767 L 490 781 Q 459 794 439 800 Q 435 801 434 795 Q 434 791 475 759 L 499 742 Z",
  "M 518 611 Q 537 638 548 646 Q 554 652 551 659 Q 550 666 534 680 Q 519 692 509 692 Q 499 691 502 679 Q 508 666 487 626 L 473 602 Q 472 601 470 597 Q 451 569 424 537 Q 418 533 417 528 Q 416 522 423 523 Q 438 526 496 585 L 518 611 Z",
  "M 496 585 Q 544 543 552 540 Q 556 540 560 546 Q 566 553 557 577 Q 548 599 518 611 L 487 626 Q 454 641 435 647 Q 431 650 430 643 Q 430 636 436 630 Q 452 618 473 602 L 496 585 Z",
  "M 729 538 Q 771 698 811 759 Q 821 769 819 780 Q 813 796 759 825 Q 744 834 730 830 Q 679 820 615 813 Q 596 813 603 801 Q 613 791 629 784 Q 641 780 709 791 Q 716 795 726 791 Q 736 784 732 759 Q 728 738 721 713 L 716 692 Q 709 664 700 632 L 693 607 Q 683 571 670 529 C 661 500 721 509 729 538 Z",
  "M 721 713 Q 703 731 645 719 Q 624 712 607 706 Q 592 703 609 690 Q 610 689 716 692 C 745 693 744 693 721 713 Z",
  "M 700 632 Q 670 650 591 622 Q 576 619 593 606 Q 597 602 609 603 Q 655 607 693 607 C 723 607 726 618 700 632 Z",
  "M 194 459 Q 179 489 171 495 Q 155 508 153 484 Q 159 448 105 384 Q 89 363 113 314 Q 129 293 143 316 Q 143 317 189 430 C 198 452 198 452 194 459 Z",
  "M 189 430 Q 217 414 245 421 Q 440 481 716 504 Q 780 511 801 508 Q 817 505 816 495 Q 794 450 770 405 L 771 404 Q 778 400 797 410 Q 855 443 902 451 Q 941 458 941 469 Q 938 479 870 537 Q 851 555 825 553 Q 779 546 729 538 L 670 529 Q 543 514 331 479 L 294 472 Q 243 466 194 459 C 164 455 161 441 189 430 Z",
  "M 517 293 Q 634 368 668 375 Q 687 379 682 396 Q 679 412 618 450 Q 600 460 578 453 Q 514 431 414 403 Q 389 396 327 398 Q 305 398 312 379 Q 319 367 338 356 Q 368 340 399 359 Q 559 416 575 410 Q 585 404 582 393 Q 545 351 502 302 C 482 279 492 277 517 293 Z",
  "M 546 249 Q 536 279 517 293 L 502 302 Q 495 308 483 311 Q 462 318 452 312 Q 439 305 453 292 Q 480 273 492 241 L 502 205 Q 523 90 492 24 Q 479 -4 442 0 Q 411 3 384 7 Q 372 8 378 -2 Q 382 -9 402 -20 Q 444 -50 459 -74 Q 469 -90 486 -88 Q 499 -87 525 -59 Q 594 25 556 210 L 546 249 Z",
  "M 556 210 Q 649 217 868 218 Q 890 218 895 228 Q 902 241 883 256 Q 828 298 784 290 Q 693 271 546 249 L 492 241 Q 338 222 158 200 Q 134 199 152 179 Q 168 164 187 158 Q 211 151 229 157 Q 382 197 502 205 L 556 210 Z",
];

const strokeVariants: Variants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fillOpacity: 0,
  },
  visible: (index: number) => ({
    opacity: 1,
    pathLength: 1,
    fillOpacity: 1,
    transition: {
      opacity: { duration: 0.05, delay: index * 0.08 },
      pathLength: { duration: 0.45, delay: index * 0.08, ease: [0.42, 0, 0.58, 1] },
      fillOpacity: { duration: 0.2, delay: index * 0.08 + 0.32 },
    },
  }),
};

interface HanziStrokeAnimationProps {
  withCard?: boolean;
}

export function HanziStrokeAnimation({
  withCard = true,
}: HanziStrokeAnimationProps) {
  const content = (
    <>
      <p className="text-3xl font-semibold leading-none text-zinc-500 sm:text-4xl">
        Verb
      </p>

      <motion.svg
        viewBox="0 0 1024 1024"
        className="mx-auto mt-6 h-56 w-56 text-zinc-500 sm:h-72 sm:w-72"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <g transform="translate(0, 900) scale(1, -1)">
          {xueStrokes.map((stroke, index) => (
            <motion.path
              key={stroke}
              d={stroke}
              custom={index}
              variants={strokeVariants}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinejoin="round"
            />
          ))}
        </g>
      </motion.svg>

      <p className="mt-3 text-3xl font-semibold leading-none text-zinc-500 sm:text-4xl">
        Xué
      </p>

      <div className="mx-auto mt-7 max-w-80 border-t-4 border-dotted border-zinc-400 pt-4">
        <div className="flex items-center justify-center gap-8 text-xl font-semibold text-black sm:text-2xl">
          <span>Study</span>
          <span className="h-10 w-[2px] bg-zinc-300" aria-hidden="true" />
          <span>Belajar</span>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      className="w-full text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {withCard ? (
        <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/80 px-8 py-12 shadow-[0_24px_80px_rgba(24,24,27,0.08)] backdrop-blur-sm sm:px-12 sm:py-16">
          {content}
        </div>
      ) : (
        content
      )}
    </motion.div>
  );
}
