import SubmissionForm from '@/components/submission/SubmissionForm';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const SubmissionPage = () => {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Submit Potentially Fake News</h1>
        <p className="text-xl text-muted-foreground">
          Help us fight misinformation by reporting content you believe to be fake or misleading.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium">What to Report</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>False or fabricated news articles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Manipulated images or videos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Misleading headlines or content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Outdated information presented as current</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Satire mistakenly shared as factual news</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Submission Process</h3>
          </div>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Submit the URL and details of the content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Our community moderators review the submission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Content is verified against reliable sources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <span>If confirmed as fake, it's added to our database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
              <span>Users are alerted when viewing the content</span>
            </li>
          </ol>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Best Practices</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Provide the exact URL of the content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Include a screenshot if possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Explain why you believe it's fake or misleading</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Provide links to contradicting evidence if available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Report in good faith and with accurate information</span>
            </li>
          </ul>
        </div>
      </div>

      <SubmissionForm />

      <div className="max-w-3xl mx-auto mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Using our Chrome Extension?</h3>
            <p className="text-sm text-blue-700">
              You can report content directly from any webpage using our Chrome extension. 
              <a href="/extension" className="underline ml-1">Learn more about the extension here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;

