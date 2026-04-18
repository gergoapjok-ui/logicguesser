/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'LogicGuesser'
const SITE_URL = 'https://logicguesser.com'

interface Props {
  title?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  emoji?: string
}

const GameNotificationEmail = ({ title, body, ctaLabel, ctaUrl, emoji }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{title || 'You have a new update on LogicGuesser'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>⚡ {SITE_NAME}</Text>
        </Section>
        <Heading style={h1}>
          {emoji ? `${emoji} ` : ''}{title || 'New activity on LogicGuesser'}
        </Heading>
        <Text style={text}>
          {body || 'Open the app to see what just happened.'}
        </Text>
        {ctaUrl ? (
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button style={button} href={ctaUrl}>
              {ctaLabel || 'Open LogicGuesser'}
            </Button>
          </Section>
        ) : null}
        <Hr style={hr} />
        <Text style={footer}>
          You are getting this because email notifications are enabled in your
          {SITE_NAME} settings. You can turn them off any time at
          {' '}<a href={`${SITE_URL}/settings`} style={link}>logicguesser.com/settings</a>.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: GameNotificationEmail,
  subject: (d: Record<string, any>) => d?.title || 'New activity on LogicGuesser',
  displayName: 'Game notification',
  previewData: {
    title: 'New friend request',
    body: 'Alex sent you a friend request on LogicGuesser.',
    ctaLabel: 'View request',
    ctaUrl: 'https://logicguesser.com/friends',
    emoji: '👥',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const header = { padding: '0 0 12px' }
const brand = { fontSize: '13px', fontWeight: 'bold', color: '#10b981', letterSpacing: '2px', margin: 0 }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '8px 0 16px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.55', margin: '0 0 16px' }
const button = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  padding: '12px 22px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e5e7eb', margin: '28px 0 14px' }
const footer = { fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }
const link = { color: '#10b981', textDecoration: 'none' }
