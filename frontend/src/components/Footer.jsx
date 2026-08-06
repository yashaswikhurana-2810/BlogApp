export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} <strong style={{ color: 'var(--accent-light)' }}>BlogApp</strong> — Made with ✦ for storytellers
        </p>
      </div>
    </footer>
  );
}
