import styled from 'styled-components';

const SessionNotificationWrapper = styled.div`
  background-color: #121212;
  color: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  .container {
      max-width: 32rem;
      width: 100%;
    }

    .card {
      background-color: rgba(24, 24, 27, 0.5);
      border: 1px solid #333;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
    }

    .gradient-bar {
      height: 0.25rem;
    }

    .card-header {
      text-align: center;
      padding: 1.5rem 1rem 1rem;
    }

    .icon-container {
      margin: 0 auto 1rem;
      height: 4rem;
      width: 4rem;
      background-color: rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: bold;
      color: white;
    }

    .card-description {
      margin-top: 0.5rem;
      color: #a1a1aa;
      font-size: 0.9rem;
    }

    .card-content {
      padding: 0.5rem 1.5rem 0.5rem;
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .options-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .option-card {
      background-color: rgba(47, 47, 55, 0.5);
      border: 1px solid rgba(75, 75, 85, 0.5);
      border-radius: 0.75rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.3s;
    }

    /* .option-card:hover {
      transform: scale(1.01);
    } */

    .option-card.primary:hover {
      border-color: rgba(34, 197, 94, 0.5);
    }

    .option-card.secondary:hover {
      border-color: rgba(239, 68, 68, 0.5);
    }

    .option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .option-icon.primary {
      color: #22c55e;
    }

    .option-icon.secondary {
      color: #ef4444;
    }

    .option-title {
      color: #fff;
      font-size: 1.1rem;
      font-weight: 500;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .option-description {
      color: #a1a1aa;
      font-size: 0.875rem;
      text-align: center;
      margin-bottom: 1rem;
      flex-grow: 1;
    }

    .Session_ContinueHere_btn, .Session_ReturnToLogin_btn {
      width: 100%;
      padding: 0.6rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: #fff;
      letter-spacing: 1px;
      .buttonload {
        margin-right: 7px;
      }
    }
    .Session_ContinueHere_btn {
      background-color: #16a34a;
    }
    .Session_ContinueHere_btn:hover {
      outline: 0;
      background-color: transparent;
      box-shadow: 0 0 3px 0 #16a34a inset, 0 0 5px 1px #16a34a;
    }
    .Session_ReturnToLogin_btn:focus {
      outline: 0;
      color: #fff;
      background-color: #16a34a;
      box-shadow:  0 0 3px 0 #16a34a inset, 0 0 5px 1px #16a34a;
    }
    .Session_ReturnToLogin_btn {
      background-color: #dc2626;
    }
    .Session_ReturnToLogin_btn:hover {
      outline: 0;
      background-color: transparent;
      box-shadow: 0 0 3px 0 #ef4444 inset, 0 0 5px 1px #ef4444;
    }
    .Session_ReturnToLogin_btn:focus {
      outline: 0;
      color: #fff;
      background-color: #ef4444;
      box-shadow:  0 0 3px 0 #ef4444 inset, 0 0 5px 1px #ef4444;
    }

    .Session_ReturnToLogin_btn:active {
      opacity: 0.6;
    }

    .footer-text {
      font-size: 0.75rem;
      text-align: center;
      color: #6b7280;
    }
`;

export default SessionNotificationWrapper;
