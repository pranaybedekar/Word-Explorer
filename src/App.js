import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { FcSpeaker } from "react-icons/fc";

function App() {
    const [data, setData] = useState([]);
    const [searchSentence, setSearchSentence] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!searchSentence) {
            setData([]);
            setError(null);
        }
    }, [searchSentence]);

    function getMeaning() {
        setLoading(true);
        const words = searchSentence.split(" ");
        const requests = words.map((word) =>
            Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`)
        );

        Promise.all(requests)
            .then((responses) => {
                const meanings = responses.map((response) => response.data[0]);
                setData(meanings);
                setError(null);
            })
            .catch((error) => {
                setError("Word not found");
                setData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function playAudio(meaning) {
        if (meaning.phonetics && meaning.phonetics.length > 0) {
            const audio = new Audio(meaning.phonetics[0].audio);
            audio.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    }

    return ( <
            div className = "App" >
            <
            h1 > Word Explorer! < /h1> <
            div className = "searchBox" >
            <
            input type = "text"
            placeholder = "Search word..."
            value = { searchSentence }
            onChange = {
                (e) => setSearchSentence(e.target.value)
            }
            /> <
            button onClick = { getMeaning } >
            <
            FaSearch size = "20px" / >
            <
            /button> < /
            div > {
                loading && < p > Loading... < /p>} {
                error && < p className = "error" > { error } < /p>} {
                data.length > 0 && ( <
                    div className = "showResults" > {
                        data.map((meaning, index) => ( <
                                div key = { index } >
                                <
                                h2 > { meaning.word } <
                                button onClick = {
                                    () => playAudio(meaning)
                                } >
                                <
                                FcSpeaker size = "26px" / >
                                <
                                /button> < /
                                h2 > <
                                h4 > Parts of speech: < /h4> <
                                p > { meaning.meanings[0].partOfSpeech } < /p> <
                                h4 > Definitions: < /h4> <
                                div > {
                                    meaning.meanings.map((m, idx) => ( <
                                            div key = { idx } >
                                            <
                                            p className = "definition" > { `${idx + 1}. ${
                      m.definitions[0].definition
                    }` } < /p> {
                                            m.definitions[0].example && ( <
                                                p className = "example" >
                                                Example: { m.definitions[0].example } <
                                                /p>
                                            )
                                        } <
                                        /div>
                                    ))
                            } <
                            /div> < /
                            div >
                        ))
                } <
                /div>
            )
        } <
        /div>
);
}

export default App;