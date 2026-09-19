import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] text-graphite-900 flex flex-col items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-rose-300 p-8 rounded-[2px] shadow-sm space-y-6 text-center">
            <div className="w-10 h-10 bg-rose-100 border border-rose-300 text-rose-800 rounded-full flex items-center justify-center mx-auto font-mono text-lg font-bold">
              !
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-rose-700 font-bold block">
                SYSTEM RECOVERY // APPLICATION ERROR
              </span>
              <h1 className="text-xl font-black uppercase text-graphite-900">
                Application Execution Interrupted
              </h1>
              <p className="text-xs text-graphite-600 leading-relaxed font-mono bg-ivory-100 p-3 border border-ivory-200 text-left overflow-x-auto">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] transition-colors cursor-pointer"
              >
                Reload Application
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/dashboard';
                }}
                className="w-full sm:w-auto px-6 py-2.5 border border-ivory-300 hover:bg-ivory-100 text-graphite-700 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
