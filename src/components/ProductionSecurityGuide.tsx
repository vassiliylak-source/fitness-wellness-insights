
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Server, Code, CheckCircle } from "lucide-react";

const ProductionSecurityGuide = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-blue-600" />
          Production Deployment Security Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <Server className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>For Production Deployment:</strong> Consider implementing these additional security measures
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Content Security Policy (CSP)</h4>
              <p className="text-sm text-gray-600">
                Add CSP headers to prevent XSS attacks. Example meta tag:
              </p>
              <code className="text-xs bg-gray-100 p-2 rounded block mt-1 font-mono">
                &lt;meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline';"&gt;
              </code>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">HTTPS Only</h4>
              <p className="text-sm text-gray-600">
                Ensure your domain uses HTTPS to encrypt data transmission and enable secure features.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Security Headers</h4>
              <p className="text-sm text-gray-600">
                Configure additional security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">File Upload Security</h4>
              <p className="text-sm text-gray-600">
                Current app includes file type and size validation. For enhanced security, consider server-side validation if adding backend processing.
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-white/50 p-3 rounded border">
          <strong>Current Status:</strong> This app follows security best practices for a client-side application. 
          No sensitive data transmission occurs, and all processing happens locally in the browser.
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionSecurityGuide;
