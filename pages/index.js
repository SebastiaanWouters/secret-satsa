import { useState, useRef, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image';
import Bitcoin from '../assets/bitcoin.png';
import Lightning from '../assets/lightning.png';
import Santa from '../assets/satsa.png';
import Done from '../assets/done.png'
import Fail from '../assets/fail.png'
import World from '../assets/worldwide.png'
import Decentralized from '../assets/decentralized.png'
import Beer from '../assets/beer.png'
import M21 from '../assets/21.png'
import Transact from '../assets/transact.png';
import { Router, useRouter } from 'next/router';
import { Form, TextArea, Input} from 'semantic-ui-react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { alpha, styled, withTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import axios from 'axios';
import { Puff } from 'react-loading-icons'

import { InfinitySpin} from  'react-loader-spinner'

const URL_PREFIX = 'https://mempool.space/tx/'


export default function EurnPage() {
    const router = useRouter();
    const bottom = useRef();
    const input = useRef();
  
    const [isLoading, setIsLoading] = useState(false);
    const [transactionUrl, setTransactionUrl] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const user = "user"

    const [boldTexts, setBoldTexts] = useState(['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Sats Claimen', 'Mislukt', 'Onderweg']);
    const [descriptionTexts, setDescriptionTexts] = useState(['Message 1', 'Message 2', 'Message 3', 'Message 4', 'Message 5','Vul hieronder het Bitcoinadres in waarop je de sats wilt ontvangen.', 'Er ging iets mis bij het verzenden, herlaad de pagina en probeer het nog een keer.', 'De transactie is gebroadcast naar het netwerk, het kan even duren vooraleer de sats in je wallet aankomen.']);
    /*const [descriptionTexts] = useState(['Ook dit jaar is de kerstman jou niet vergeten. Hij brengt weer een hoop satoshis, speciaal voor jou!', 'test2', 'test3', 'Vul hieronder het Bitcoinadres in waarop je de sats wilt ontvangen.', 'Er ging iets mis bij het verzenden, herlaad de pagina en probeer het nog een keer.', 'De transactie is gebroadcast naar het netwerk, het kan nog even duren vooraleer je sats in je wallet aankomen']);*/
    const [images, setImages] = useState([Santa, M21, M21, Beer, Bitcoin, Transact, Fail, Done]);
    const [pageIndex, setPageIndex] = useState(0);
    const [address, setAddress] = useState("");

    let succesIndex = descriptionTexts.length -1
    let failIndex = succesIndex - 1;
    let addressIndex = succesIndex - 2;
    
    const theme = createTheme({
        palette: {
            mode: "dark",
            accent: {
                main: '#F7931A',
                dark: '#F7931A'
            }
            
        }
    });

    const CssTextField = styled(TextField)({
        '& label.Mui-focused': {
          color: 'orange',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: 'orange',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'orange',
          },
          '&:hover fieldset': {
            borderColor: 'orange',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'orange',
          },
        },
      });

      const MyButton = styled(Button)({
        marginTop: "3px"
      });

    async function broadcastTx() {
        // GET request using axios with async/await
        setIsLoading(true);
        try {
            const response = await axios.get(`https://secret-satsa.vercel.app/api/${user}/${address}`
          );
            
            if (response.status === 200) {
                console.log(response.status)
                setIsLoading(false);
                setTransactionUrl(`${URL_PREFIX}${response.data.txid}`)
                setPageIndex(succesIndex);
            } else {
                setIsLoading(false);
                setPageIndex(failIndex);
            }
        } catch {
            setIsLoading(false);
            setPageIndex(failIndex);
        }
        
        
    }
    
    const toggleInputFocus = (value) => {
        setIsTyping(prevValue => value);
    }

    const scrollToBottom = () => {
        if (bottom.current) {
            bottom.current.scrollIntoView({ behavior: "smooth" });
        }
      }
      
      useEffect(() => {
        scrollToBottom();
        
      }, [pageIndex, isTyping, isLoading]);
      useEffect(() => {
        scrollToBottom();
      });

    async function nextPage() {
        if (pageIndex === addressIndex) {
            await broadcastTx();
        } else {
            setPageIndex(prevCount => prevCount + 1);
        }
    }

    function updateAddress(value) {
        setAddress(value, () => { 
            console.log(address);
         });
    }

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
      };

    return (
        <>
        <Head>
        <title>Secret Satsa</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <div className='outerContainer'>
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes"></meta>
                {(!isLoading && !isTyping) && <div className='mainContainer'>
                    <Image className='image' src={images[pageIndex]}
                        alt="Picture of bitcoin lightning logo"
                        height="142"></Image>
                    <div className='textContainer'>
                        <div className='boldText'><h1>{boldTexts[pageIndex]}</h1></div>
                        <div className='descriptionText'><p>{descriptionTexts[pageIndex]}</p></div>
                        {pageIndex === addressIndex && <div className='textInput'><CssTextField fullWidth id="outlined-basic" onClick={() => toggleInputFocus(true)} value={address} onChange={(e) => updateAddress(e.target.value)} label="Bitcoin Adres" variant="outlined" /></div>}
                        {pageIndex === succesIndex && <MyButton onClick={() => openInNewTab(transactionUrl)} variant="outlined" color="accent">Volg hier</MyButton>}
                    </div>
                </div>}
                {(pageIndex !== failIndex && !isLoading && pageIndex !== succesIndex && !isTyping) && <div className='bottomContainer'>
                        <div className='paginationContainer'>
                            {boldTexts.slice(0, -1).map((text, index) => {
                                return (
                                    pageIndex === index ? <div onClick={() => {setPageIndex(index)}}className='dotActive'></div> : <div onClick={() => {if (index !== succesIndex && index !== failIndex) {setPageIndex(index)}}} className='dot'></div>
                                )
                            })}
                        </div>
                        <button onClick={nextPage} className='button'><p className='buttonText'>VOLGENDE</p></button>
                </div>}
                {isLoading && <div className='mainContainer'>
                <Puff stroke="#F7931A" strokeOpacity={.825} />

                </div>}
                {isTyping && <div className='mainContainerTyping'>
                <Image className='image' src={images[pageIndex]}
                        alt="Picture of bitcoin lightning logo"
                        height="125"></Image>
                    <div className='textContainer'>
                        <div className='boldText'><h1>{boldTexts[pageIndex]}</h1></div>
                        <div className='descriptionText'><p>{descriptionTexts[pageIndex]}</p></div>
                        <div className='textInput'><CssTextField fullWidth id="outlined-basic" autoFocus onBlur={() => toggleInputFocus(false)} value={address} onChange={(e) => updateAddress(e.target.value)} label="Bitcoin Adres" variant="outlined" /></div>
                    </div>
                </div>}
            </div>
            <div ref={bottom}></div>
        </ThemeProvider>
        </>
    )
}
