import '@/styles/model-loader.css';
import { useTranslation } from '@/locales';

interface LoaderProps {
  /**
   * Real model-load progress 0–100. While a number is provided the bar and
   * text reflect it; when omitted (or null) the bar falls back to the
   * indeterminate demo animation.
   */
  progress?: number | null;
  className?: string;
  width?: string;
}

const Loader = ({ progress, className, width }: LoaderProps) => {
  const { t } = useTranslation();
  const determinate = typeof progress === "number";
  const pct = determinate
    ? Math.max(0, Math.min(100, progress as number))
    : 0;

  return (
    <div
      className={`ml-container ${className || ""}`}
      style={width ? { width } : undefined}
      role="status"
      aria-label={t.upscaleWorkspace?.loadingModel || "Loading AI model"}
    >
      <div
        className={`ml-bar${determinate ? " ml-bar--determinate" : ""}`}
        style={{ width: `${pct}%` }}
      />
      <div className="ml-text">
        {`${Math.round(pct)}%`}
      </div>
      <div className="ml-particles">
        <div className="ml-particle" />
        <div className="ml-particle" />
        <div className="ml-particle" />
        <div className="ml-particle" />
        <div className="ml-particle" />
      </div>
    </div>
  );
};

export default Loader;
