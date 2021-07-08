import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './../../styles/app.css'
import img2 from './../../images/img3.svg'
import img3 from './../../images/dot.svg'
import img4 from './../../images/dot-full.svg'
import img5 from './../../images/dot-full.svg'
import img11 from './../../images/logo.svg'

let DefaultHomePage=()=>{

    const [author, setAuthor]=useState("")
    const [quote, setQuote]=useState("")

    useEffect(()=>{
        (
            async()=>{
                let response=await fetch("https://type.fit/api/quotes")
                let content=await response.json()
                let randomValue=Math.floor(Math.random() * content.length) + 1
                setAuthor(content[randomValue].author)
                setQuote(content[randomValue].text) 
            }
        )()
    },[])

    useEffect(()=>{
        setInterval(()=>{
            console.log()
        },5000);
    })

    let changeImg=(e)=>{

        let landingImg=document.querySelector('.landing-img')
        let imgBtn1=document.querySelector('.change-btn1')
        let imgBtn2=document.querySelector('.change-btn2')
        let imgBtn3=document.querySelector('.change-btn3')

        console.log(landingImg.src)
        if(e==="one"){
            landingImg.src=require('./../../images/img3.svg').default
            imgBtn1.src=require('./../../images/dot-full.svg').default
            imgBtn2.src=require('./../../images/dot.svg').default
            imgBtn3.src=require('./../../images/dot.svg').default
        }
        else if(e==="two"){
            landingImg.src=require('./../../images/img1.svg').default
            imgBtn1.src=require('./../../images/dot.svg').default
            imgBtn2.src=require('./../../images/dot-full.svg').default
            imgBtn3.src=require('./../../images/dot.svg').default
        }
        else if(e==="three"){
            landingImg.src=require('./../../images/img2.svg').default
            imgBtn1.src=require('./../../images/dot.svg').default
            imgBtn2.src=require('./../../images/dot.svg').default
            imgBtn3.src=require('./../../images/dot-full.svg').default
        }
    }

    return(
        <div className="default-home-page">
            <div className="section-one">
                <header>
                    <div className="logo-container">   
                        <div className="logo-name"><br />
                            <svg id="logo-stroke" width="115" height="48" viewBox="0 0 139 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M35.136 8.12001V6.12001H33.136H16.24H14.24V8.12001V10.36V12.3196L16.1992 12.3596L17.376 12.3836V56.5892L12.4221 51.5219L10.7067 49.7672L9.33414 51.8013L4.02214 59.6733L2.97957 61.2183L4.44738 62.367C5.70146 63.3485 7.49763 64.1608 9.66719 64.8692C11.9197 65.6047 14.0934 65.992 16.176 65.992C17.6705 65.992 19.0675 65.7809 20.3638 65.3675L21.376 66.4028V64.9951C24.1173 63.847 26.3644 61.7252 28.0825 58.7227C30.7951 54.0986 32 46.8165 32 37.24V12.3836L33.1768 12.3596L35.136 12.3196V10.36V8.12001ZM59.5782 46.7491L59.0247 46.7604L57.0655 46.8004V48.76V51V53H59.0655H75.9405H77.9405H78.3295H80.3295H91.9565H93.9565V51V48.76V46.7967L91.9935 46.7604L90.5741 46.7341L91.4121 23.9744L101.155 44.6834L101.695 45.832H102.964H104.948H106.252L106.778 44.64L116.013 23.7302L118.121 46.7362L116.815 46.7604L114.852 46.7967V48.76V51V53H116.852H134.581H136.581V51V48.76V46.8106L134.632 46.7607L133.835 46.7402L129.124 12.3812L130.266 12.3596L132.228 12.3226V10.36V8.12001V6.12001H130.228H116.98H115.657L115.14 7.33761L107.951 24.2493L99.5748 7.23657L99.0251 6.12001H97.7805H83.0605H81.0605V8.12001V10.36V12.324L83.0241 12.3597L84.2406 12.3818L78.725 46.7392L78.1076 46.7551L76.6124 46.7245L62.3566 6.87041L61.81 5.34207L60.2018 5.56254L52.2658 6.65054L51.0633 6.8154L50.6544 7.95819L36.7827 46.7245L35.0247 46.7604L33.0655 46.8004V48.76V51V53H35.0655H49.5295H51.5295V51V48.76V46.7988L49.5687 46.7604L48.6985 46.7433L50.0151 40.2H57.7413L59.5782 46.7491ZM55.9137 33.832H51.3322L53.2436 24.3353L55.9137 33.832Z" stroke="#FF0000" stroke-width="4"/>
                            </svg>
                        </div>
                        <div className="rate-anime">
                            <div className="heart-rate">
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="120px" height="73px" viewBox="0 0 150 73" enable-background="new 0 0 150 73">
                                    <polyline fill="none" stroke="#ff0000" stroke-width="3" stroke-miterlimit="10" points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"/>
                                </svg>
                                <div className="fade-in"></div>
                                <div className="fade-out"></div>
                            </div>
                        </div>
                        {/* <img src={img11} alt="logo" /> */}
                    </div>
                    <nav>
                        <NavLink activeClassName="active-admin-link-default" to="/">                        
                            <span className="nav-link">Home</span>
                        </NavLink>
                        <NavLink activeClassName="active-admin-link-default" to="">
                            <span className="nav-link">About</span>
                        </NavLink>
                        <NavLink activeClassName="active-admin-link-default" to="">                        
                            <span className="nav-link">Contact</span>
                        </NavLink>
                    </nav>
                </header>
                <main>
                    <section className="presentation">
                        <div className="introduction"><br/>
                            <div className="intro-text">
                                <h2>Let's Get start</h2>
                                <div class="quote">
                                    <p class="quotes">{quote}</p>
                                    <p class="auth">-{author}</p>
                                </div>
                            </div>
                            <div className="cta">
                                {/* <button className="cta-select">14 Inch</button> */}
                                <button onClick={()=>window.location.href='/login'} className="pushable">
                                    <span className="shadow"></span>
                                    <span className="edge"></span>
                                    <span className="front">
                                        Get Started <i className="fas fa-angle-right start-icon"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="cover">
                            <img src={img2} className="landing-img" alt="matebook" />
                        </div>
                    </section>
                    <div className="laptop-select">
                        <img src={img5} className="change-btn1" onClick={()=>changeImg('one')} alt="one" />
                        <img src={img3} className="change-btn2" onClick={()=>changeImg('two')} alt="two" />
                        <img src={img3} className="change-btn3" onClick={()=>changeImg('three')} alt="three" />
                    </div>
                </main>
            </div>
            <div className="section-two">

            </div>
            <div className="section-three">

            </div>
        </div>
    );
}

export default DefaultHomePage;
