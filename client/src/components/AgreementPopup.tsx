/* 
this is a pop component that accepts a prop called agreeNeeded. 
if agreeNeeded is true, the user must read the whole content of 
the popup, and push a button acknowledging he read it. 
if agreeNeeded is false, the user can just press the x 
button to close the popup

upon implementation - insert correct texts and implement 
the handleAgree function
*/

import React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface AgreementPopupProps {
  agreeNeeded: boolean;
}

const AgreementPopup: FC<AgreementPopupProps> = ({ agreeNeeded }) => {
  const [showPopUp, setShowPopUp] = useState<boolean>(true);
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const contentText: Array<String> = [
    'אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפאני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ',
    ' אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר'
  ];

  const handleClose = (ev: React.MouseEvent<HTMLElement>) => {
    if (ev.currentTarget !== ev.target || agreeNeeded) return;

    setShowPopUp(false);
  };

  const handleAgree = () => {
    //enter logic for clicking agree
  };

  useEffect(() => {
    const element = contentRef.current;
    if (element && element.scrollHeight <= element.clientHeight) {
      setButtonEnabled(true);
    }
  }, [contentRef]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const element = e.currentTarget;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      setButtonEnabled(true);
    }
  };

  return (
    <>
      {showPopUp && (
        <div className="pop-up-background" onClick={handleClose}>
          <div dir="rtl" className="pop-up-window">
            {!agreeNeeded && (
              <AiOutlineClose
                className="pop-up-window__close-btn"
                onClick={handleClose}
                title="סגור"
              />
            )}
            <p className="pop-up-window__content" onScroll={handleScroll} ref={contentRef}>
              {contentText[agreeNeeded ? 1 : 0]}
            </p>
            {agreeNeeded && (
              <div className="pop-up-window--bottom-nav">
                <button
                  className="pop-up-window--bottom-nav__agree-btn"
                  onClick={handleAgree}
                  disabled={!buttonEnabled}>
                  אני מסכים לתנאים
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AgreementPopup;
