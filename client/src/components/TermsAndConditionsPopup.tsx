/* 
this is a pop component that accepts a prop called agreeNeeded. 
if agreeNeeded is true, the user must read the whole content of 
the popup, and push a button acknowledging he read it. 
if agreeNeeded is false, the user can just press the x 
button to close the popup

upon implementation - insert correct texts and implement 
the handleAgree function
*/

import React, { FC, useEffect, useRef, useState } from 'react';
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
        <article className="pop-up-window__content" onScroll={handleScroll} ref={contentRef}>
          <p>
            <strong>תקנון האתר</strong>
          </p>
          <p>
            <strong>כללי</strong>
          </p>
          <p>
            <span>1. ברוך הבא לאתר callforhelp.vercel.app (להלן: “האתר”).</span>
            <span>2. האתר הוקם ומתוחזק על ידי מתנדבים, שהקימו אותו לרגל המלחמה שהחלה בדרום.</span>
            <span>3. מטרת האתר היא:</span>
            <span className="sub">
              3.1. לאפשר מפגש בין אנשים הזקוקים לאוזן קשבת ותמיכה לאור מצב החירום במדינה, לבין
              מתנדבים המוכנים להטות אוזן קשבת ולספק תמיכה.
            </span>
            <span className="sub">
              3.2. להוות פלטפורמה בה מי שזקוק לכך, ימצא אוזן קשבת יוכל לפרוק את אשר על ליבו, לאוורר
              מתחים ורגשות, ובעיקר למצוא אוזן קשבת.
            </span>
            <span>
              4. השימוש באתר, הינו בכפוף לתנאים המפורטים להלן בתקנון זה (להלן: "תקנון האתר" או
              "התקנון").
            </span>
            <span>
              5. המשתמש באתר (להלן: "המשתמש") נדרש לקרוא בעיון תקנון זה בטרם הגלישה והשימוש באתר.
            </span>
            <span>
              6. המשך הגלישה והשימוש באתר, לרבות תחילת שיחה ו/או התכתבות עם משתמש אחר באתר, מהווים
              הסכמת המשתמש כדין להוראות תקנון זה.{' '}
            </span>
            <span>
              7. מובהר בזה כי משתמש שאינו מסכים לאמור בתקנון, מתבקש לא לעשות כל שימוש באתר.
            </span>
            <span>
              8. הנהלת האתר רשאית לשנות את תנאי התקנון מעת לעת, לפי שיקול דעתה, ללא צורך במסירת
              הודעה מוקדמת כלשהיא ותוקפו של השינוי יחל מרגע פרסומו והודעתו לציבור באתר.{' '}
            </span>
            <span>
              9. השימוש בתקנון זה בלשון זכר הינו לצורכי נוחיות בלבד, וכל האמור בתקנון זה מתייחס הן
              לגברים והן לנשים. השימוש בלשון יחיד מתייחס לרבים וכן ההיפך, לפי העניין.{' '}
            </span>
            <span>10. כותרות הסעיפים הינן לצרכי נוחיות בלבד, ולא ישמשו לפרשנותו של תקנון זה. </span>
            <span>
              11. כל סכסוך ו/או חילוקי-דעות שיתגלעו בקשר לתקנון זה, בקשר לתקפותו, יישומו, פרשנותו,
              ביצועו, אכיפתו ו/או בקשר לכל עניין הנובע ממנו ו/או הנוגע לאתר, יהיו בסמכותו הבלעדית של
              בית המשפט המוסמך בעיר חיפה, ולאף ערכאה אחרת לא תהיה הסמכות לדון בו.
            </span>
            <span>12. השימוש באתר הינו אך ורק לבגיר אשר מלאו לו 18 שנים. </span>
          </p>
          <p>
            <strong>התנהלות הולמת</strong>
          </p>
          <p>
            <span>
              13. כל משתמש באתר מתחייב לעשות כן בהתנדבות מלאה, לא לבקש ו/או לקבל ממשתמש אחר כלשהו
              טובת הנאה כלשהי מכל מין או סוג ולא לעשות שימוש באתר לקידום מטרה מסחרית ו/או פוליטית
              ו/או אחרת כלשהי.
            </span>
            <span>
              14. משתמשי האתר מתבקשים להתנהל בצורה הולמת, לא לעשות שימוש בשפה בוטה, ולהיות רגישים
              לרגשות המשתמשים האחרים.
            </span>
            <span>
              15. משתמשי האתר מתבקשים להפעיל שיקול דעת, ובכל מקרה בו הם מרגישים כי תוכן השיחה אינו
              הולם ו/או אינו נעים להם ו/או גורם להם תחושת אי נוחות כלשהי, לסיים את השיחה באופן
              מכובד, ואם לדעתם משתמש אחר באתר פעל/התבטא/התנהל באופן שאינו הולם ו/או פוגעני ו/או לא
              תקין בכל היבט אחר, לדווח על כך באופן מיידי להנהלת האתר באמצעות הקישור: "צור קשר".
            </span>
            <span>
              16. הנהלת האתר תהיה רשאית לפעול באופן מיידי וללא התראה, על מנת למנוע את השימוש (לחסום)
              ממשתמש שהפר את הוראות תקנון זה לרבות בשל התנהלות לא הולמת, פגיעה ברגשות של משתמש אחר,
              שימוש בשפה בוטה ולא הולמת.
            </span>
          </p>
          <p>
            <strong>פרטי המשתמש</strong>
          </p>
          <p>
            <span>
              17. בעת ההרשמה לאתר יידרש המשתמש להזין פרטים אישיים כגון: שם משתמש וכתובת דואר
              אלקטרוני. ייתכן שיהיה צורך בהזנת פרטים נוספים המתבקשים באתר. המשתמש מאשר בזאת כי מסירת
              הפרטים האישיים במהלך ההרשמה נעשית על פי רצונו בלבד ובהסכמתו המלאה.
            </span>
            <span>
              18. המשתמש מאשר כי ידוע לו שמסירת פרטים כוזבים ו/או פרטים שאינם שלו במזיד נחשבת כעבירה
              פלילית וכי במקרה של מסירת פרטים כוזבים ייתכנו צעדים משפטיים אזרחיים ופליליים, לרבות
              תביעות בגין נזקים שיגרמו, במישרין ו/או בעקיפין לאתר ו/או למי ממשתמשי האתר בשל כך.
            </span>
          </p>
          <p>
            <strong>שירות לקוחות</strong>
          </p>
          <p>
            19. כל צוות האתר עושה כן בהתנדבות, האתר הוקם במהירות לאור המצב, וככל שיש למי ממשתמשי
            האתר הצעות לשיפור, ביקורת בונה, וגם מילה טובה, נשמח אם תפנו אלינו באמצעות לשונית "צור
            קשר" באתר.{' '}
          </p>
          <p>
            <strong>פרטיות</strong>
          </p>
          <p>
            <span>
              20. הנהלת האתר נוקטת באמצעי זהירות מקובלים על מנת לשמור, ככל האפשר, על סודיות המידע של
              המשתמשים.{' '}
            </span>
            <span>
              21. לצורך נוחות השימוש של המשתמשים באתר, השיחות שתנהלו במסגרתו תישמרנה בשרתי האתר.
            </span>
            <span>
              22. מובהר כי האתר אינו אתר מסחרי, והאמצעים שאנו יכולים להקדיש לביטחון המידע הם מוגבלים
              ובוודאי שאין באפשרותנו לשלוט בשימוש שייעשה במידע על ידי משתמש אחר בפניו בחרתם לחשוף
              אותו. לפיכך, המשתמש מתבקש להפעיל שיקול דעת לגבי סוג המידע שהוא בוחר לחשוף בפני משתמשים
              אחרים באתר.
            </span>
            <span>
              23. הנהלת האתר תשמור בסודיות את המידע של המשתמשים השמור באתר, למעט אם תידרש למסור
              פרטים כאמור על פי צו שיפוטי ו/או לפי דין ו/או על פי בקשה מגורם משפטי מוסמך ו/או לצורך
              סיוע לרשויות אכיפה ממשלתיות ו/או לצורך הגנה על ביטחון ושימוש המשתמשים באתר /או אם תעלה
              טענה ו/או יתעורר חשד כי המשתמש ביצע מעשה ו/או מחדל הפוגע ו/או עלול לפגוע במשתמש אחר או
              בצד שלישי כלשהו ו/או חשד כי המשתמש ביצע שימוש שיש בו משום לאפשר, לסייע ו/או לעודד
              ביצועו של מעשה בלתי חוקי ו/או חשוד כמעשה בלתי חוקי ו/או שימוש שיש בו משום הפרת תנאי
              מתנאי התקנון .
            </span>
            <span>
              24. רישום הפרטים באתר ו/או השימוש באתר מהווה הסכמה של המשתמש לכך שהמידע שמסר יישמר
              בשרתי האתר וכי הוא עושה כן מרצונו הטוב והחופשי. משתמש רשאי לדרוש מהנהלת האתר בכתב, כי
              המידע המתייחס אליו יימחק משרתי האתר.{' '}
            </span>
          </p>
          <p>
            <strong>זכויות יוצרים וזכויות קנין רוחני</strong>
          </p>
          <p>
            <span>
              25. כל זכויות הקניין הרוחני, מכל מין וסוג, לרבות, זכויות היוצרים וסימני מסחר, בתוכן
              באתר, לרבות עיצוב האתר, אייקונים (ICONS), גרפיקות, תמונות המוצרים, צילומים, איורים,
              קטעי וידיאו ואודיו, טקסטים, לוגו (LOGO) וכיו"ב (להלן: "המידע") מוגנים ע"י חוקי זכויות
              יוצרים של מדינת ישראל ו/או חוקי זכויות יוצרים של מדינות אחרות. המידע הוא קניינה של
              הנהלת האתר ו/או המתנדבים שהקימו את האתר ו/או של צדדים שלישיים אשר התירו לאתר לפרסם את
              המידע נשוא זכויות היוצרים באתר.{' '}
            </span>
            <span>
              26. אין להעתיק, לשכפל, להפיץ, למכור, לשווק ולתרגם או לעשות כל שימוש פרטי או מסחרי
              בבסיס הנתונים ובמידע המופיע באתר ואין להציג את האתר בעיצוב וממשק גרפי שונה מזה שקבעה
              לו הנהלת האתר, בלא קבלת הסכמת הנהלת האתר בכתב ומראש.
            </span>
            <span>
              27. המשתמש מכיר בזכויות היוצרים הקיימות במידע ומתחייב שלא לעשות כל שימוש כזה או אחר
              במידע או כל שימוש בניגוד לאמור בדיני זכויות היוצרים במדינת ישראל או בארצות אחרות
              ובאמנות הרלוונטיות או לגרום לכל שינוי שהוא בכל חלק מהנתונים והמידע המופיע באתר.
            </span>
          </p>
          <p>
            <strong>הגבלת אחריות</strong>
          </p>
          <p>
            <span>28. האתר הוא פלטפורמה המקשרת בין משתמשים.</span>
            <span>
              29. הנהלת האתר אינה מייצרת ו/או קובעת ו/או משפיעה על התכנים שיעלו משתמשי האתר והיא
              אינה אחראית ואינה יכולה להיות אחראית לתכנים שיוחלפו בים המשתמשים באתר במסגרת שיחות
              ו/או התכתבויות ביניהם.
            </span>
            <span>
              30. השימוש באתר נעשה באחריותו הבלעדית של המשתמש, שמתחייב לא להעלות בקשר לכך כל טענה
              ו/או דרישה ו/או תביעה נגד הנהלת האתר ו/או מי מהמתנדבים שהקימו ומתחזקים אותו.
            </span>
            <span>
              31. הנהלת האתר לא תישא בכל אחריות לכל שימוש לרעה ו/או לא הולם ו/או פוגעני שייעשה באתר
              על ידי מי מהמשתמשים.
            </span>
          </p>
        </article>
        {agreeNeeded && (
          <div className="pop-up-window--bottom-nav">
            <div className={`container ${!buttonsEnabled && 'container-disabled'}`}>
              <button
                className={`checkmark ${marked && 'marked'}`}
                type="button"
                onClick={() => setMarked((prev) => buttonsEnabled && !prev)}>
                {marked ? (
                  <>
                    <svg
                      className="glow-border"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none">
                      <g filter="url(#filter0_d_556_1719)">
                        <rect
                          x="4.5"
                          y="4.5"
                          width="15"
                          height="15"
                          rx="1.5"
                          stroke="#0159FF"
                          shape-rendering="crispEdges"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_556_1719"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB">
                          <feFlood flood-opacity="0" result="BackgroundImageFix" />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.00416667 0 0 0 0 0.349389 0 0 0 0 1 0 0 0 0.5 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_556_1719"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_556_1719"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                    <svg
                      className="check"
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="10"
                      viewBox="0 0 11 10"
                      fill="none">
                      <path
                        d="M1 5.5L3.5 9L9.5 1"
                        stroke="#0159FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none">
                    <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#0E1C74" />
                  </svg>
                )}
              </button>
              <span onClick={() => setMarked((prev) => buttonsEnabled && !prev)}>
                אני מאשר כי קראתי את התקנון ואני מסכים להוראותיו
              </span>
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
