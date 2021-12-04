
import barba from '@barba/core';
import imagesLoaded from 'imagesloaded';
import observer from './observer';
import gsap from 'gsap';

export default () => {

    const bodyTag = document.querySelector('body');

    barba.init({
        transitions: [
            {
                name: "switch",
                once( { current, next, trigger } ) {
                    return new Promise(resolve => {
                        const images = document.querySelectorAll('img');

                        gsap.set(next.container, { 
                            opacity: 0. 
                        })

                        imagesLoaded(images, () => {
                            const timeline = gsap.timeline( { 
                                onComplete() {
                                    observer();
                                    resolve();
                                }
                             } );
    
                             timeline
                                .to(next.container, { 
                                    opacity: 1, 
                                    delay: 1 
                                })
                        })

                    })
                },
                leave( { current, next, target } ) {

                    return new Promise(resolve => {
                        const timeline = new gsap.timeline({ 
                            onComplete() {
                                current.container.remove();
                                resolve();
                            }
                        });

                        timeline
                            .to('header', {
                                y: "-100%",
                            }, 0)
                            .to('footer', {
                                y: "100%",
                            }, 0)
                            .to(current.container, {
                                opacity: 0,
                            });
                    })

                },
                enter( { current, next, target }  ) {

                    return new Promise(resolve => {

                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })

                        const timeline = new gsap.timeline({ 
                            onComplete() {
                                observer();
                                resolve();
                            }
                        });
                        
                        timeline
                            .set(next.container, {
                                opacity: 0,
                            })
                            .to('header', {
                                y: "0%",
                            }, 0)
                            .to('footer', {
                                y: "0%"
                            }, 0)
                            .to(next.container, {
                                opacity: 1,
                            });
                    })

                }
            },
        ],
        views: [
            {
                namespace: "products",
                beforeEnter() {
                    bodyTag.classList.add('product');
                },
                afterLeave() {
                    bodyTag.classList.remove('product');
                }
            }
        ],
        debug: true,
    });

    // re-run scripts... I can see this being UGLY if there was a lot going on
    // barba.hooks.beforeEnter((data) => {
    //     observer();
    // });

}


