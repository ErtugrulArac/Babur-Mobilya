"use client"

interface PearlButtonProps {
  children?: React.ReactNode
  href?: string
  onClick?: () => void
  small?: boolean
}

export function PearlButton({ children = "Pearl Button", href, onClick, small }: PearlButtonProps) {
  const inner = (
    <button className="pearl-btn" onClick={onClick}>
      <div className="pearl-wrap">
        <p>
          <span>✧</span>
          <span>✦</span>
          {children}
        </p>
      </div>
    </button>
  )

  return (
    <>
      <style>{`
        .pearl-btn {
          --white: #ffe7ff;
          --bg: #080808;
          --radius: 100px;
          outline: none;
          cursor: pointer;
          border: 0;
          position: relative;
          border-radius: var(--radius);
          background-color: var(--bg);
          transition: all 0.2s ease;
          box-shadow:
            inset 0 0.3rem 0.9rem rgba(255,255,255,0.3),
            inset 0 -0.1rem 0.3rem rgba(0,0,0,0.7),
            inset 0 -0.4rem 0.9rem rgba(255,255,255,0.5),
            0 3rem 3rem rgba(0,0,0,0.3),
            0 1rem 1rem -0.6rem rgba(0,0,0,0.8);
        }
        .pearl-wrap {
          font-size: ${small ? "clamp(10px, 1.8vw, 12px)" : "clamp(12px, 2.5vw, 16px)"};
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          padding: ${small ? "clamp(10px, 1.8vw, 12px) clamp(14px, 2.5vw, 20px)" : "clamp(12px, 2.5vw, 18px) clamp(20px, 4vw, 32px)"};
          border-radius: inherit;
          position: relative;
          overflow: hidden;
        }
        .pearl-wrap p {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          transition: all 0.2s ease;
          transform: translateY(2%);
          mask-image: linear-gradient(to bottom, white 40%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, white 40%, transparent);
        }
        .pearl-wrap p span:nth-child(2) { display: none; }
        .pearl-btn:hover .pearl-wrap p span:nth-child(1) { display: none; }
        .pearl-btn:hover .pearl-wrap p span:nth-child(2) { display: inline-block; }
        .pearl-wrap::before,
        .pearl-wrap::after {
          content: "";
          position: absolute;
          transition: all 0.3s ease;
        }
        .pearl-wrap::before {
          left: -15%; right: -15%;
          bottom: 25%; top: -100%;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.12);
        }
        .pearl-wrap::after {
          left: 6%; right: 6%;
          top: 12%; bottom: 40%;
          border-radius: 22px 22px 0 0;
          box-shadow: inset 0 10px 8px -10px rgba(255,255,255,0.8);
          background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%);
        }
        .pearl-btn:hover {
          box-shadow:
            inset 0 0.3rem 0.5rem rgba(255,255,255,0.4),
            inset 0 -0.1rem 0.3rem rgba(0,0,0,0.7),
            inset 0 -0.4rem 0.9rem rgba(255,255,255,0.7),
            0 3rem 3rem rgba(0,0,0,0.3),
            0 1rem 1rem -0.6rem rgba(0,0,0,0.8);
        }
        .pearl-btn:hover .pearl-wrap::before { transform: translateY(-5%); }
        .pearl-btn:hover .pearl-wrap::after  { opacity: 0.4; transform: translateY(5%); }
        .pearl-btn:hover .pearl-wrap p       { transform: translateY(-4%); }
        .pearl-btn:active {
          transform: translateY(4px);
          box-shadow:
            inset 0 0.3rem 0.5rem rgba(255,255,255,0.5),
            inset 0 -0.1rem 0.3rem rgba(0,0,0,0.8),
            inset 0 -0.4rem 0.9rem rgba(255,255,255,0.4),
            0 3rem 3rem rgba(0,0,0,0.3),
            0 1rem 1rem -0.6rem rgba(0,0,0,0.8);
        }
      `}</style>

      {href ? (
        <a href={href} style={{ textDecoration: "none" }}>
          {inner}
        </a>
      ) : inner}
    </>
  )
}
