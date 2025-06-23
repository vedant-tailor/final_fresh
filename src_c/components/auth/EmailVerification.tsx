import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onResendEmail: () => Promise<void>;
}

export function EmailVerification({ email, onResendEmail }: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail();
      toast({
        title: "Verification email sent",
        description: "We've sent a new verification email to your inbox."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification email",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification email to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Please check your email inbox</p>
              <p className="text-sm text-blue-600 mt-1">
                Click the verification link in the email we sent to activate your account.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>Didn't receive the email? Check your spam folder or</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleResendEmail} 
          variant="outline" 
          className="w-full"
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Resend Verification Email"}
        </Button>
        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
