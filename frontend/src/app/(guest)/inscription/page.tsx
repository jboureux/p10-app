import SignUpForm from "./_components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="fixed inset-0 min-h-screen bg-[#EEF3F6] flex items-center justify-center px-4">
      <div className="bg-white text-gray-800 rounded-2xl shadow-md w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-mono text-center text-[#C62828] mb-6">
          Créer un compte
        </h1>

        <SignUpForm />
      </div>
    </div>
  );
}
