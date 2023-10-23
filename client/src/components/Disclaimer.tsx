import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Header from './Header';
import React from 'react';
import Button from './Button';
import Paragraph from './Paragraph';

const Disclaimer: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (Cookies.get('acceptedDisclaimer') !== 'true') {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('acceptedDisclaimer', 'true');
    setShowDisclaimer(false);
  };

  return showDisclaimer ? (
    <div className='disclaimer'>
      <Header>שיחות בין אנשים</Header>
      <div className='content'>
        <Paragraph isBold={false} dir={'rtl'}>
          משתמש יקר, חשוב לנו להבהיר כי האתר הינו פלטפורמה שנועדה לאפשר מפגש אונליין בין אנשים
          הזקוקים לאוזן קשבת ותמיכה לאור מצב החירום במדינה, לבין מתנדבים המוכנים להטות אוזן קשבת
          ולספק תמיכה. האתר איננו אתר של ייעוץ ו/או טיפול ו/או תמיכה נפשית מקצועיים, והוא אינו מתיימר
          להעניק ייעוץ/טיפול נפשי מקצועי כלשהו. המתנדבים באתר הינם אנשים רגילים, שלא בהכרח באים מרקע
          טיפולי. המטרה היא לאפשר למי שזקוק לכך בימים קשים אלה, מקום בו יוכל לפרוק את אשר על ליבו,
          לאוורר מתחים ורגשות, ובעיקר למצוא אוזן קשבת. ככל שלמי ממשתמשי האתר יש הצעות לשיפור, ביקורת
          בונה או כל הערה אחרת, אנא פנו אלינו. ככל שמי מהמשתמשים נתקל בהתנהלות לא הולמת של מי
          מהמשתמשים האחרים, אנא יידעו אותנו בדחיפות. אנו מאחלים לכולנו ימים טובים יותר.
        </Paragraph>
        <Button onClick={handleAccept}>אני רוצה להצטרף</Button>
      </div>
    </div>
  ) : (
    <></> // you have to return some jsx from a component
  );
};

export default Disclaimer;
