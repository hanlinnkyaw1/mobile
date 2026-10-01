import React from 'react';
import RemotePage from '../components/RemotePage';

const MOCK_EXAM_URL = 'https://www.jlptburmese.com/jlpt-mock-exam/jlptmocktest.html';

export default function JLPTWebViewScreen() {
  return (
    <RemotePage
      url={MOCK_EXAM_URL}
      title="JLPT mock exam"
      description="This full website-based mock exam requires an internet connection. For a completely offline exam, use JLPT Practice from the Home screen."
    />
  );
}
