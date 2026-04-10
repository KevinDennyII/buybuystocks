export function Layout({ children }) {
  return (
    <div className="layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {children}
    </div>
  );
}
