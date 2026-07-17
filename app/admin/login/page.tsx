import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin-login-page container">
      <div className="admin-login-card">
        <h1>مدیریت آرشیو</h1>
        <p>Mustapha Samady Literary Archive</p>
        <LoginForm />
      </div>
    </div>
  );
}
