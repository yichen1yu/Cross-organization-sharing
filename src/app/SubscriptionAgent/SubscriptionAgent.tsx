import * as React from 'react';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import ChatbotHeader, {
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotHeaderActions,
  ChatbotHeaderCloseButton,
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import { Alert } from '@patternfly/react-core';

import type { AgentMessage, ScenarioId } from './types';
import { classifyIntent, isEditFollowUp, FALLBACK_MESSAGE } from './scenarioRouter';
import { handleScenario, handleEditFollowUp } from './scenarios';
import { WELCOME_TITLE, WELCOME_DESCRIPTION, WELCOME_PROMPTS, FOOTNOTE_LABEL, FOOTNOTE_DESCRIPTION } from './welcomePrompts';

const BOT_AVATAR = 'https://www.redhat.com/favicon.ico';

let msgCounter = 0;
function nextId(): string {
  msgCounter += 1;
  return `msg-${msgCounter}-${Date.now()}`;
}

function formatTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const SubscriptionAgent: React.FunctionComponent = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [messages, setMessages] = React.useState<AgentMessage[]>([]);
  const [isThinking, setIsThinking] = React.useState(false);
  const [lastScenarioId, setLastScenarioId] = React.useState<ScenarioId | null>(null);
  const [awaitingFollowUp, setAwaitingFollowUp] = React.useState(false);
  const [skillToast, setSkillToast] = React.useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messageBoxRef = React.useRef<any>(null);

  const lastUserMsgRef = React.useRef<HTMLDivElement>(null);

  const scrollToLastUserMsg = React.useCallback(() => {
    setTimeout(() => {
      lastUserMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, []);

  const scrollToBottom = React.useCallback(() => {
    setTimeout(() => {
      messageBoxRef.current?.scrollToBottom({ behavior: 'smooth' });
    }, 100);
  }, []);

  const addBotMessage = React.useCallback((content: string, extras?: Partial<AgentMessage>) => {
    const msg: AgentMessage = {
      id: nextId(),
      role: 'bot',
      content,
      timestamp: formatTimestamp(),
      ...extras,
    };
    setMessages((prev) => [...prev, msg]);
    scrollToLastUserMsg();
    return msg;
  }, [scrollToLastUserMsg]);

  const handleSend = React.useCallback(async (input: string | number) => {
    const userText = String(input).trim();
    if (!userText) return;

    const userMsg: AgentMessage = {
      id: nextId(),
      role: 'user',
      content: userText,
      timestamp: formatTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    if (awaitingFollowUp && lastScenarioId && isEditFollowUp(userText)) {
      setIsThinking(true);
      const { message, stillAwaitingFollowUp } = await handleEditFollowUp(userText, lastScenarioId);
      addBotMessage(message, {
        scenarioId: lastScenarioId,
        confidence: 'high',
        showQuickStarts: !stillAwaitingFollowUp,
      });
      setAwaitingFollowUp(stillAwaitingFollowUp);
      setIsThinking(false);
      return;
    }

    const scenarioId = classifyIntent(userText);

    if (!scenarioId) {
      setIsThinking(true);
      await new Promise((r) => setTimeout(r, 300));
      addBotMessage(FALLBACK_MESSAGE, { confidence: 'medium' });
      setAwaitingFollowUp(false);
      setIsThinking(false);
      return;
    }

    if (lastScenarioId && scenarioId !== lastScenarioId) {
      const labelMap: Record<ScenarioId, string> = {
        'usage': 'Subscription Usage',
        'expiring': 'Subscription Renewals',
        'notification': 'Notification Setup',
        'hypervisor': 'Hypervisor Lookup',
        'multi-month': 'Usage Report',
        'sca': 'SCA Status',
        'registration': 'System Registration',
        'aws-vm': 'AWS VM Setup',
      };
      setSkillToast(labelMap[scenarioId] || scenarioId);
      setTimeout(() => setSkillToast(null), 3000);
    }

    setIsThinking(true);
    setLastScenarioId(scenarioId);

    try {
      const result = await handleScenario(scenarioId, userText);

      const fullResponse = result.editPrompt
        ? `${result.readOnlyResponse}\n\n---\n\n${result.editPrompt}`
        : result.readOnlyResponse;

      addBotMessage(fullResponse, {
        scenarioId: result.scenarioId,
        citations: result.citations,
        confidence: result.confidence,
      });

      setAwaitingFollowUp(!!result.editPrompt);
    } catch {
      addBotMessage(
        "I encountered an error while processing your request. Please try again or rephrase your question.",
        { confidence: 'low' }
      );
      setAwaitingFollowUp(false);
    } finally {
      setIsThinking(false);
    }
  }, [awaitingFollowUp, lastScenarioId, addBotMessage, scrollToBottom]);

  const [showAllPrompts, setShowAllPrompts] = React.useState(false);
  const VISIBLE_PROMPT_COUNT = 4;

  const handleWelcomePromptClick = React.useCallback((promptMessage: string) => {
    handleSend(promptMessage);
  }, [handleSend]);

  const welcomePrompts = React.useMemo(() => {
    const visible = showAllPrompts ? WELCOME_PROMPTS : WELCOME_PROMPTS.slice(0, VISIBLE_PROMPT_COUNT);
    return visible.map((p) => ({
      title: p.title,
      onClick: () => handleWelcomePromptClick(p.message),
    }));
  }, [handleWelcomePromptClick, showAllPrompts]);

  const footnoteProps = React.useMemo(() => ({
    label: FOOTNOTE_LABEL,
    popover: {
      title: 'About this AI Assistant',
      description: FOOTNOTE_DESCRIPTION,
      link: {
        label: 'View Red Hat AI policy',
        url: 'https://www.redhat.com/en/about/ai-policy',
      },
    },
  }), []);

  return (
    <div style={{ position: 'fixed', zIndex: 9999, bottom: 0, right: 0 }}>
      <style>{`
        .pf-chatbot__header {
          padding: 6px 12px !important;
        }
        .pf-chatbot__question {
          font-size: 14px !important;
          font-weight: 400 !important;
        }
        .pf-chatbot__prompt-suggestion .pf-v6-c-card__header {
          padding: 8px 12px !important;
        }
        .pf-chatbot__prompt-suggestion .pf-v6-c-card__title {
          font-size: 13px !important;
        }
        .pf-chatbot__prompt-suggestions {
          gap: 6px !important;
        }
        .pf-chatbot__footer-container {
          padding: 0 12px 8px 12px !important;
          row-gap: 4px !important;
        }
        .pf-chatbot__footnote {
          font-size: 11px !important;
        }
        .pf-chatbot__message-bar {
          padding-block: 2px !important;
          min-height: 36px !important;
        }
        .pf-chatbot__message-textarea {
          line-height: 1.25rem !important;
          font-size: 14px !important;
        }
      `}</style>
      <ChatbotToggle
        tooltipLabel="Subscription Agent"
        isChatbotVisible={isVisible}
        onToggleChatbot={() => setIsVisible((prev) => !prev)}
        isRound
      />

      <Chatbot
        displayMode={ChatbotDisplayMode.default}
        isVisible={isVisible}
        ariaLabel="Red Hat Subscription Agent"
      >
        <ChatbotHeader>
          <ChatbotHeaderMain>
            <ChatbotHeaderTitle>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={BOT_AVATAR} alt="" style={{ width: 16, height: 16 }} />
                Red Hat Subscription Agent
              </span>
            </ChatbotHeaderTitle>
          </ChatbotHeaderMain>
          <ChatbotHeaderActions>
            <ChatbotHeaderCloseButton onClick={() => setIsVisible(false)} />
          </ChatbotHeaderActions>
        </ChatbotHeader>

        {skillToast && (
          <Alert
            variant="info"
            isInline
            isPlain
            title={`Switched to ${skillToast} skill`}
            style={{ padding: '4px 16px', fontSize: '13px' }}
          />
        )}

        <ChatbotContent>
          <MessageBox
            ref={messageBoxRef}
            ariaLabel="Subscription agent messages"
            enableSmartScroll
          >
            {messages.length === 0 && (
              <>
                <ChatbotWelcomePrompt
                  title={WELCOME_TITLE}
                  description={WELCOME_DESCRIPTION}
                  prompts={welcomePrompts}
                />
                {WELCOME_PROMPTS.length > VISIBLE_PROMPT_COUNT && (
                  <div style={{ textAlign: 'center', padding: '4px 0 12px' }}>
                    <button
                      onClick={() => setShowAllPrompts((prev) => !prev)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--pf-t--global--color--brand--default)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {showAllPrompts ? 'Show less' : `Show ${WELCOME_PROMPTS.length - VISIBLE_PROMPT_COUNT} more`}
                    </button>
                  </div>
                )}
              </>
            )}
            {messages.map((msg, idx) => {
              const isLastUserMsg = msg.role === 'user' && !messages.slice(idx + 1).some((m) => m.role === 'user');
              return (
                <div key={msg.id} ref={isLastUserMsg ? lastUserMsgRef : undefined}>
                  <Message
                    role={msg.role}
                    content={msg.content}
                    name={msg.role === 'bot' ? 'Subscription Agent' : 'You'}
                    avatar={msg.role === 'bot' ? BOT_AVATAR : undefined}
                    avatarProps={msg.role === 'bot' ? { size: 'sm' as const } : undefined}
                    alignment="start"
                    timestamp={msg.timestamp}
                    isLoading={msg.isLoading}
                    quickResponses={msg.showQuickStarts ? WELCOME_PROMPTS.map((p) => ({
                      id: p.title,
                      content: p.title,
                      onClick: () => handleSend(p.message),
                    })) : undefined}
                    actions={msg.role === 'bot' ? {
                      positive: {
                        onClick: () => {},
                        ariaLabel: 'Good response',
                      },
                      negative: {
                        onClick: () => {},
                        ariaLabel: 'Bad response',
                      },
                      copy: {
                        onClick: () => { navigator.clipboard.writeText(msg.content); },
                        ariaLabel: 'Copy response',
                      },
                    } : undefined}
                  />
                </div>
              );
            })}
            {isThinking && (
              <Message
                key="loading"
                role="bot"
                avatar={BOT_AVATAR}
                avatarProps={{ size: 'sm' as const }}
                name="Subscription Agent"
                isLoading
                content=""
              />
            )}
          </MessageBox>
        </ChatbotContent>
        <ChatbotFooter>
          <MessageBar
            onSendMessage={handleSend}
            placeholder="Ask about your Red Hat subscriptions..."
            isThinking={isThinking}
          />
          <ChatbotFootnote {...footnoteProps} />
        </ChatbotFooter>
      </Chatbot>
    </div>
  );
};

export default SubscriptionAgent;
