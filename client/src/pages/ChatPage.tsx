import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { Message } from '../components/Message';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, query, where, addDoc } from '@firebase/firestore';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';
import { auth, collections } from '../firebase/connection';
import {
  Role,
  assignSupportee,
  assignSupporter,
  finishChat,
  getNameById,
  getOppositeRoleFieldName
} from '../helpers/chatFunctions';

/*
  TODO - take care of the disconnect events
  TODO - take care of cases in which the chat id doesnt exist
  TODO - leave socket room on exiting
*/

export const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    // redirect if user not logged in
    if (!userLoading && !user) {
      navigate('/');
    }

  }, [userLoading, user, navigate]);

  useEffect(() => {
    if (!chatId) navigate('/selection');
  }, [chatId, navigate]);

  useEffect(() => {
    if (!chatLoading && !chat) navigate('/selection');
  }, [chat, chatLoading, navigate]);

  

  if (!role) page = <></>; // should be replaced with loading state once we have it
  else if (role === 'supportee' && !chat?.supporterId)
    page = (
      <div className="waiting-state">
        <h3>אנחנו מאתרים עבורך תומך</h3>
        <p>נשימות עמוקות דרך הפה למשך 4 שניות עוזרות במיקוד הנשימה והרפיה של הגוף</p>
      </div>
    );

  return page;
};
