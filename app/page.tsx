"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [message, setMessage] = useState("");
  const [regexPattern, setRegexPattern] = useState(""); // State for regex pattern
  const [tokens, setTokens] = useState<string[]>([]);
  const [isCopiedId, setIsCopiedId] = useState<string>(""); // State to track copied status
  const [completedTokens, setCompletedTokens] = useState<number[]>([]); // State to track completed tokens
  const [replacePattern, setReplacePattern] = useState(""); // State for replace pattern
  const [history, setHistory] = useState<
    { pattern: string; tokens: string[] }[]
  >([]);

  const handleTokenizeSnowflake = () => {
    const regex =
      /(usecase\/.*?\/(raw_.*?))\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\.\d{3}\s+([+-]\d{2}\d{2})\s+\d+/g;

    const matches = [...message.matchAll(regex)];
    const result = matches.map((match) => {
      const token = match[1]; // The token part
      const dateString = `${match[3]} ${match[4]}`; // Constructing the date string with timezone
      const dateWithoutTimezone = dateString.replace(/ \+\d{4}$/, ""); // Remove the timezone offset
      const date = new Date(dateWithoutTimezone); // Create a Date object in local time
      const utcDate = new Date(date.getTime() - 8 * 60 * 60 * 1000); // Subtract 8 hours to convert to UTC
      const isoString = utcDate.toISOString().replace(/\.\d{3}Z$/, "Z"); // Convert to ISO string
      return `${token} ${isoString}`; // Return the token with the UTC date
    });

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

    // Add to history
    setHistory((prev) => [
      ...prev,
      { pattern: regex.source, tokens: groupedTokens },
    ]);
  };

  const handleTokenizeOutlook = () => {
    const regex =
      /(usecase\/.*?\/(raw_.*?))\/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/g;

    const matches = [...message.matchAll(regex)];
    const result = matches.map((match) => `${match[1]} ${match[3]}`);

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

    // Add to history
    setHistory((prev) => [
      ...prev,
      { pattern: regex.source, tokens: groupedTokens },
    ]);
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

  const handleApply = (pattern: string, replacePattern: string) => {
    const regex = new RegExp(pattern);
    const replacedMessage = message.replace(regex, replacePattern);
    setHistory((prev) => [
      ...prev,
      { pattern: pattern, tokens: replacedMessage.split(" ") },
    ]);
    setMessage(replacedMessage);
  };

  const handleDelete = (pattern: string) => {
    setHistory((prev) => prev.filter((item) => item.pattern !== pattern));
  };

  const handleCheckboxChange = (index: number) => {
    setCompletedTokens((prev) => {
      const newCompletedTokens = [...prev];
      newCompletedTokens[index] = 0;
      return newCompletedTokens;
    });
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row gap-4 md:flex-col md:mt-32">
        <div>
          <div className="w-96">
            <Textarea
              className="min-w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Paste your copied emails titles here."
            />
          </div>
          <div className="flex gap-x-4 mt-4 w-full justify-start">
            <Button onClick={handleTokenizeOutlook}>Tokenize Outlook</Button>
            <Button onClick={handleTokenizeSnowflake}>
              Tokenize Snowflake
            </Button>
          </div>
          {tokens.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-bold">Tokens:</h4>
              <ul className="flex flex-col divide-y divide-gray-200">
                {tokens.map((token, index) => {
                  const splitTokens = token.split(" "); // Split the token by space
                  return (
                    <div key={index} className="items-center flex gap-x-2">
                      <Checkbox
                        checked={completedTokens[index] >= 2}
                        onCheckedChange={() => handleCheckboxChange(index)}
                      />
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
        </div>
        {history.length > 0 && (
          <div className="w-96">
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Enter regex pattern"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter replace pattern"
                value={replacePattern}
                onChange={(e) => setReplacePattern(e.target.value)}
              />
              <div className="flex flex-row gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => handleApply(regexPattern, replacePattern)}
                >
                  Apply
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => handleDelete(regexPattern)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <h4 className="font-semibold">History:</h4>
            <ul className="flex flex-col divide-y divide-gray-200 text-xs ">
              {history.map((item, index) => (
                <li key={index}>
                  <h4 className="font-semibold">{item.pattern}</h4>
                  <ul className="flex flex-col divide-y divide-gray-200">
                    {item.tokens.map((token, index) => (
                      <li key={index}>{token}</li>
                    ))}
                  </ul>
                  <div className="flex gap-x-2">
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        handleApply(item.pattern, item.tokens[index])
                      }
                    >
                      Apply
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => handleDelete(item.pattern)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      {/* <footer>footer</footer> */}
    </div>
  );
}
