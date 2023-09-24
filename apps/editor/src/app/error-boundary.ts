import React from 'react';

export class ErrorBoundary extends React.Component<
  {
    fallback: React.ReactNode;
    children: React.ReactNode;
  },
  {
    hasError: boolean;
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
