import React, { useState } from "react";
import styles from "./BionicToggle.module.css";

function BionicToggle({ contentClassName }: { contentClassName: string }): JSX.Element {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [originalText, setOriginalText] = useState<{ [key: number]: string }>(
    {}
  );

  // Components to be considered can be added here
  const componentNames: string[] = ["p", "span"];

  const handleToggle = () => {
    const componentSelectors: string = componentNames
      .map((name) => `.${contentClassName} ${name}`)
      .join(", ");
    const textTags: NodeListOf<HTMLElement> =
      document.querySelectorAll(componentSelectors);

    // Loop through each text tag and modify its text content
    textTags.forEach((el: HTMLElement, i: number) => {
      // Toggle on - store the original text and update the tag content
      if (!isToggled) {
        const textNodes: any = el.childNodes;
        let originalText = "";
        let boldText = "";

        // Loop through each child node of the tag
        textNodes.forEach((node: Node) => {
          // If the child node is a text node
          if (node.nodeType === Node.TEXT_NODE) {
            const text: string = node.textContent as string;
            boldText += boldWords(text).join(" ");
            originalText += text;
          }
          // If the child node is a p or span tag
          else if (node.nodeName === "P" || node.nodeName === "SPAN") {
            const text: string = node.textContent as string;
            const boldChildText: string | null = text
              ? boldWords(text).join(" ")
              : null;
            el.innerHTML = boldChildText as string;
            originalText += text;
          }
        });

        // Update the original text and tag content
        if (el.nodeType === Node.TEXT_NODE) {
          if (boldText) el.textContent = boldText;
          setOriginalText((prevState) => ({ ...prevState, [i]: originalText }));
        } else if (el.nodeName === "P" || el.nodeName === "SPAN") {
          if (boldText) el.innerHTML = boldText;
          setOriginalText((prevState) => ({ ...prevState, [i]: originalText }));
        }
      }
      // Toggle off - retrieve the original text and update the tag content
      else {
        if (el.nodeType === Node.TEXT_NODE) {
          el.textContent = originalText[i];
        } else if (el.nodeName === "P" || el.nodeName === "SPAN") {
          el.innerHTML = originalText[i];
        }
      }
    });
    // Toggle the isToggled state
    setIsToggled(!isToggled);
  };

  const boldWords = (text: string): string[] => {
    const first = "<strong>";
    const last = "</strong>";
    return text
      .split(" ")
      .map((x: string) =>
        x.length === 1
          ? first + x + last
          : first +
            x.slice(0, Math.round(x.length / 2)) +
            last +
            x.slice(Math.round(x.length / 2))
      );
  };

  return (
    <div className="container">
      <button className={isToggled ?  styles.on : styles.off} onClick={handleToggle}>
        <span className={styles.pin}>B</span>
      </button>
    </div>
  );
}

export default BionicToggle;
