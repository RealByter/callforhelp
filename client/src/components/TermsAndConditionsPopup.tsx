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
import Button from './Button';

interface TermsAndConditionsPopupProps {
  agreeNeeded?: boolean;
  onClose: () => void;
}

const TermsAndConditionsPopup: FC<TermsAndConditionsPopupProps> = ({ agreeNeeded, onClose }) => {
  const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(false);
  const [marked, setMarked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const contentText: Array<string> = [
    'אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפאני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ אני התוכן שמספיק ללחוץ איקס כדי לסגור את הפופאפ',
    ' אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשראני התוכן שחייב לאשר אני התוכן שחייב לאשר אני התוכן שחייב לאשר'
  ];

  const handleClose = (ev: React.MouseEvent<HTMLElement>) => {
    if (ev.currentTarget !== ev.target || agreeNeeded) return;

    onClose();
  };

  useEffect(() => {
    const element = contentRef.current;
    if (element && element.scrollHeight <= element.clientHeight) {
      setButtonsEnabled(true);
    }
  }, [contentRef]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const element = e.currentTarget;
    
    if (element.scrollHeight - element.scrollTop - 1 <= element.clientHeight) {
      // the -1 is for natural inaccuracy purposes
      setButtonsEnabled(true);
    }
  };

  return (
    <div className="pop-up-background" onClick={handleClose}>
      <div dir="rtl" className="pop-up-window">
        {!agreeNeeded && (
          <AiOutlineClose
            tabIndex={0}
            className="pop-up-window__close-btn"
            onClick={onClose}
            title="סגור"
          />
        )}
        <p className="pop-up-window__content" onScroll={handleScroll} ref={contentRef}>
          {contentText[agreeNeeded ? 1 : 0]}
        </p>
        {agreeNeeded && (
          <div className="pop-up-window--bottom-nav">
            <div className={`container ${!buttonsEnabled && 'disabled'}`}>
              אני מאשר כי קראתי את התקנון ואני מסכים להוראותיו
              <button
                disabled={!buttonsEnabled}
                className={`checkmark ${marked && 'marked'}`}
                type="button"
                onClick={() => setMarked((prev) => !prev)}></button>
            </div>
            <Button
              className="pop-up-window--bottom-nav__agree-btn"
              onClick={onClose}
              disabled={!buttonsEnabled || !marked}>
              אישור
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;
