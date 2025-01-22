"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CopyIcon, CheckIcon } from "lucide-react";

// const RegexReplacer = ({
//   message,
//   setMessage,
// }: {
//   message: string;
//   setMessage: (newMessage: string) => void;
// }) => {
//   const [pattern, setPattern] = useState("");
//   const [replacement, setReplacement] = useState("");

//   const handleRegexReplace = () => {
//     try {
//       const regex = new RegExp(pattern, "g"); // Create a global regex
//       const newMessage = message.replace(regex, replacement); // Apply regex replace
//       setMessage(newMessage); // Update the message
//     } catch (error) {
//       alert(`Invalid regex pattern! Please check and try again. ${error}`);
//     }
//   };

//   return (
//     <div className="grid gap-y-2 w-fit items-center">
//       {/* <h4>Regex Replacer</h4> */}
//       <Input
//         className="w-fit"
//         type="text"
//         placeholder="Enter regex pattern"
//         value={pattern}
//         onChange={(e) => setPattern(e.target.value)}
//       />
//       <Input
//         className="w-fit"
//         type="text"
//         placeholder="Replacement text"
//         value={replacement}
//         onChange={(e) => setReplacement(e.target.value)}
//       />
//       <Button onClick={handleRegexReplace}>Apply Regex Replace</Button>
//     </div>
//   );
// };
// const RegexReplacer = ({
//   message,
//   setMessage,
// }: {
//   message: string;
//   setMessage: (newMessage: string) => void;
// }) => {
//   const [pattern, setPattern] = useState("");
//   const [replacement, setReplacement] = useState("");
//   const [history, setHistory] = useState<
//     { pattern: string; replacement: string; previousMessage: string }[]
//   >([]);

//   const handleRegexReplace = () => {
//     try {
//       const regex = new RegExp(pattern, "g"); // Create a global regex
//       const newMessage = message.replace(regex, replacement); // Apply regex replace

//       // Add to history
//       setHistory([
//         ...history,
//         { pattern, replacement, previousMessage: message },
//       ]);

//       setMessage(newMessage); // Update the message
//       setPattern(""); // Clear the pattern input
//       setReplacement(""); // Clear the replacement input
//     } catch (error) {
//       alert(`Invalid regex pattern! Please check and try again. ${error}`);
//     }
//   };

//   const handleUndo = (index: number) => {
//     // Retrieve the previous state of the message
//     const selectedHistory = history[index];
//     setMessage(selectedHistory.previousMessage);

//     // Remove the undone pattern from history
//     setHistory(history.slice(0, index));
//   };

//   const handleApplyHistory = (index: number) => {
//     const selectedHistory = history[index];
//     try {
//       const regex = new RegExp(selectedHistory.pattern, "g");
//       const newMessage = message.replace(regex, selectedHistory.replacement);
//       setMessage(newMessage);

//       // Push the current message to history
//       setHistory([
//         ...history,
//         { pattern: selectedHistory.pattern, replacement: selectedHistory.replacement, previousMessage: message },
//       ]);
//     } catch (error) {
//       alert("Failed to apply the regex. Please check the pattern.");
//     }
//   };

//   return (
//     <div className="space-y-4 w-fit items-center">
//       <div className="grid gap-y-2">
//         <Input
//           className="w-fit"
//           type="text"
//           placeholder="Enter regex pattern"
//           value={pattern}
//           onChange={(e) => setPattern(e.target.value)}
//         />
//         <Input
//           className="w-fit"
//           type="text"
//           placeholder="Replacement text"
//           value={replacement}
//           onChange={(e) => setReplacement(e.target.value)}
//         />
//         <Button onClick={handleRegexReplace}>Apply Regex Replace</Button>
//       </div>

//       {history.length > 0 && (
//         <div className="space-y-2">
//           <h4 className="text-lg font-semibold">Regex History</h4>
//           <ul className="list-disc list-inside">
//             {history.map((item, index) => (
//               <li key={index} className="flex justify-between items-center">
//                 <span>
//                   Pattern: <span className="font-mono">{item.pattern}</span>, Replace:{" "}
//                   <span className="font-mono">{item.replacement}</span>
//                 </span>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleApplyHistory(index)}
//                   >
//                     Apply
//                   </Button>
//                   <Button
//                     size="sm"
//                     onClick={() => handleUndo(index)}
//                   >
//                     Undo
//                   </Button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };
const RegexReplacer = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (newMessage: string) => void;
}) => {
  const [pattern, setPattern] = useState("");
  const [replacement, setReplacement] = useState("");
  const [history, setHistory] = useState<
    { pattern: string; replacement: string }[]
  >([]);

  const handleRegexReplace = () => {
    try {
      const regex = new RegExp(pattern, "g"); // Create a global regex
      const newMessage = message.replace(regex, replacement); // Apply regex replace

      // Add the pattern and replacement to the history
      setHistory([...history, { pattern, replacement }]);

      setMessage(newMessage); // Update the message
      setPattern(""); // Clear the pattern input
      setReplacement(""); // Clear the replacement input
    } catch (error) {
      alert(`Invalid regex pattern! Please check and try again. ${error}`);
    }
  };

  const handleApplyHistory = (index: number) => {
    // Reapply the regex operation based on the history entry
    const { pattern, replacement } = history[index];

    try {
      const regex = new RegExp(pattern.trim(), "g");
      const newMessage = message.replace(regex, replacement); // Reapply the regex

      setMessage(newMessage);
    } catch (error) {
      alert(`Failed to reapply regex pattern. Please check the pattern.`);
    }
  };

  const handleUndoHistory = (index: number) => {
    // Undo the regex operation by reversing the replacement
    const { pattern, replacement } = history[index];
    try {
      const regex = new RegExp(replacement, "g"); // Reverse regex operation
      const newMessage = message.replace(regex, pattern); // Undo the regex operation
      setMessage(newMessage);
    } catch (error) {
      alert(`Failed to undo regex pattern. Please check the pattern.`);
    }
  };

  return (
    <div className="space-y-4 w-fit items-center">
      <div className="grid gap-y-2">
        <Input
          className="w-fit"
          type="text"
          placeholder="Enter regex pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
        <Input
          className="w-fit"
          type="text"
          placeholder="Replacement text"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
        />
        <Button onClick={handleRegexReplace}>Apply Regex Replace</Button>
      </div>

      {history.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Regex History</h4>
          <ul className="list-disc list-inside">
            {history.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  Pattern: <span className="font-mono">{item.pattern}</span>,
                  Replace: <span className="font-mono">{item.replacement}</span>
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyHistory(index)}
                  >
                    Apply
                  </Button>
                  <Button size="sm" onClick={() => handleUndoHistory(index)}>
                    Undo
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const regexPatterns: string[] = [
  "From Subject Received Size Categories",
  `sin0r4app2152xp-noreply@gic.com.sg \[DIF\] Job failure`,
  "d+:d+Ww+Wd+Ww+",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [isCopiedId, setIsCopiedId] = useState<string>(""); // State to track copied status
  const [completedTokens, setCompletedTokens] = useState<number[]>([]); // State to track completed tokens

  const handleTokenize = () => {
    const regex =
      /(usecase\/.*?\/raw_eod_pe_investment_delta)\/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/g;

    const matches = [...message.matchAll(regex)];
    const result = matches.map((match) => `${match[1]} ${match[2]}`);

    // Group tokens and count occurrences
    const tokenCountMap: { [key: string]: number } = {};
    result.forEach((token) => {
      tokenCountMap[token] = (tokenCountMap[token] || 0) + 1;
    });

    // Convert the map back to an array of strings with counts
    const groupedTokens = Object.entries(tokenCountMap).map(
      ([token, count]) => `${token} ${count}`
    );

    setTokens(groupedTokens); // Store the grouped result in state
  };

  const handleCopy = (token: string, index: number) => {
    navigator.clipboard.writeText(token);
    setIsCopiedId(token);
    setCompletedTokens((prev) => {
      const newCompletedTokens = [...prev];
      // increment the count of the token for each index
      const tokenCount = prev[index] ? prev[index] + 1 : 1;
      newCompletedTokens[index] = tokenCount;

      return newCompletedTokens;
    });
    setTimeout(() => setIsCopiedId(""), 2000); // Reset after 2 seconds
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main>
        <div className="flex gap-x-4">
          <div className="grid w-full min-w-96 gap-2">
            <Textarea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Paste your copied emails titles here."
            />
            <Button onClick={handleTokenize}>Tokenize</Button>
          </div>
          <RegexReplacer message={message} setMessage={setMessage} />
        </div>

        {tokens.length > 0 && (
          <div>
            <h4>Tokens:</h4>

            <ul>
              {tokens.map((token, index) => {
                const splitTokens = token.split(" "); // Split the token by space
                return (
                  <div key={index} className="items-center flex gap-x-2">
                    <Checkbox checked={completedTokens[index] === 2} />
                    {splitTokens.map((splitToken, splitIndex) => {
                      return (
                        <li key={splitIndex}>
                          {splitToken}
                          {splitIndex === 2 ? null : (
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => handleCopy(token, index)}
                              className="ml-2"
                            >
                              {isCopiedId === splitToken ? (
                                <CheckIcon />
                              ) : (
                                <CopyIcon />
                              )}
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </div>
                );
              })}
            </ul>
          </div>
        )}
      </main>
      {/* <footer>footer</footer> */}
    </div>
  );
}
