import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import Markdown from 'react-markdown';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  materialDark,
  nightOwl,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ChatBubble = ({
  message,
  index,
  isUser,
  isLoading,
  lastMessageRef,
  totalMessages,
}) => (
  <div
    key={message.id}
    ref={index === totalMessages - 1 ? lastMessageRef : null}
    className={`chat ${isUser ? 'chat-start' : 'chat-end'}`}
  >
    <div className="chat-image avatar">
      <div className="w-12 p-2 rounded bg-base-200">
        <img
          src={`/${isUser ? 'icon-user.png' : 'icon-bot.png'}`}
          alt=""
          className="invert"
        />
      </div>
    </div>
    <div className={`prose chat-bubble ${isUser ? 'chat-bubble-primary' : ''}`}>
      <Markdown
        children={message.content}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                children={String(children).replace(/\n$/, '')}
                style={nightOwl}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
    <div className="chat-footer">
      {isUser || index !== totalMessages - 1 ? (
        <time className="text-xs opacity-50">
          {dayjs(message.createdAt).format('h:mm A')}
        </time>
      ) : null}
      {isLoading && !isUser && index === totalMessages - 1 ? (
        <FontAwesomeIcon icon={faSpinner} spinPulse fixedWidth />
      ) : null}
      {index === totalMessages - 1 && !isLoading ? (
        <time className="text-xs opacity-50">
          {dayjs(message.createdAt).format('h:mm A')}
        </time>
      ) : null}
    </div>
  </div>
);

ChatBubble.displayName = 'ChatBubble';
ChatBubble.propTypes = {
  index: PropTypes.number,
  isLoading: PropTypes.bool,
  isUser: PropTypes.bool,
  lastMessageRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.Element) }),
  ]),
  message: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  totalMessages: PropTypes.number,
};