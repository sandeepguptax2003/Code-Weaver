import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  Select,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const url = "https://code-weaver-backend.vercel.app";

function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("//Type Your Code Here \u{1F4BB}");
  const [outputPlaceholder, setOutputPlaceholder] = useState("//Output Will Be Shown Here \u{1F604}");

  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = monaco.editor.create(document.getElementById("editor"), {
      language: "javascript",
      theme: "vs-dark",
    });
  }, []);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleConvert = async () => {
    try {
      setInputPlaceholder(""); // Remove input placeholder when user starts typing
      const code = editorRef.current.getValue();
      if (code.trim() === "" || selectedLanguage === "") {
        alert("Editor can not be Empty!");
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${url}/convert`, {
        code,
        targetLanguage: selectedLanguage,
      });
      setConvertedCode(response.data.convertedCode);
    } catch (error) {
      console.error("Error during code conversion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebug = async () => {
    try {
      setInputPlaceholder(""); // Remove input placeholder when user starts typing
      const code = editorRef.current.getValue();
      if (code.trim() === "") {
        alert("Editor can not be Empty!");
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${url}/debug`, {
        code,
      });
      setConvertedCode(response.data.debuggedCode);
    } catch (error) {
      console.error("Error during code debugging:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualityCheck = async () => {
    try {
      setInputPlaceholder(""); // Remove input placeholder when user starts typing
      const code = editorRef.current.getValue();
      if (code.trim() === "") {
        alert("Editor can not be Empty!");
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${url}/quality-check`, {
        code,
      });
      setConvertedCode(response.data.checkedCode);
    } catch (error) {
      console.error("Error during quality check:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const textEditorBgColor = useColorModeValue("white", "gray.800");
  const outputBgColor = useColorModeValue("gray.100", "gray.700");
  const outputTextColor = useColorModeValue("black", "white");

  return (
    <Box p={4}>
      <Center mb={"30px"}>
        <Heading>Code-Weaver</Heading>
      </Center>
      <Grid templateColumns="repeat(4, 1fr)" margin={"40px auto"} alignItems="center" width={"80%"} gap={"40px"}>
        <Select value={selectedLanguage} onChange={handleLanguageChange} variant="outline">
          <option value="">Select Language</option>
          <option value="java">Java</option>
          <option value="C">C</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="php">PHP</option>
          {/* Add more language options */}
        </Select>
        <Button colorScheme="orange" onClick={handleConvert} disabled={isLoading}>
          Convert
        </Button>
        <Button colorScheme="orange" onClick={handleDebug}>
          Debug
        </Button>
        <Button colorScheme="orange" onClick={handleQualityCheck}>
          Quality Check
        </Button>
      </Grid>
      <Grid templateColumns="repeat(1, 1fr)" gap={4}>
        <Box p={4} borderWidth="1px" borderRadius="md" bg={textEditorBgColor}>
          <Heading size="md" mb={4} color={outputTextColor}>
            Input
          </Heading>
          <Box id="editor" height="400px" placeholder={inputPlaceholder} />
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="md" bg={outputBgColor}>
          <Heading size="md" mb={4} color={outputTextColor}>
            Output
          </Heading>
          <Textarea
            value={isLoading ? "Code is Loading Please Wait \u{1F604}..." : convertedCode}
            readOnly
            h="400px"
            resize="none"
            bg={textEditorBgColor}
            color={outputTextColor}
            placeholder={outputPlaceholder}
          />
        </Box>
      </Grid>
    </Box>
  );
}

export default CodeEditor;
