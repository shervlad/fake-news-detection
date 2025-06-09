import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Upload, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { flaggedContentApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const SubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { isAuthenticated, user } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      url: '',
      title: '',
      contentType: '',
      platform: '',
      reason: '',
      details: '',
      includeScreenshot: false,
      termsAgreed: false
    }
  });

  const contentType = watch('contentType');
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare submission data
      const submissionData = {
        url: data.url,
        title: data.title,
        content_type: data.contentType,
        platform: data.platform,
        description: data.details,
        reason: data.reason,
        has_screenshot: !!selectedFile
      };
      
      // Add user ID if authenticated
      if (isAuthenticated && user) {
        submissionData.user_id = user.id;
      }
      
      // Submit to API
      await flaggedContentApi.create(submissionData);
      
      // Handle screenshot upload if present
      if (selectedFile) {
        // In a real implementation, we would upload the screenshot
        // This would typically be done with a FormData object
        console.log('Would upload file:', selectedFile);
      }
      
      setSubmitSuccess(true);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const contentTypeOptions = [
    { value: 'article', label: 'News Article' },
    { value: 'social_post', label: 'Social Media Post' },
    { value: 'video', label: 'Video' },
    { value: 'image', label: 'Image' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'other', label: 'Other' }
  ];
  
  const platformOptions = [
    { value: 'News Website', label: 'News Website' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Twitter/X', label: 'Twitter/X' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Reddit', label: 'Reddit' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Blog', label: 'Blog' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Potentially Fake News</CardTitle>
        <CardDescription>
          Report content that you believe contains misinformation or fake news.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Thank You!</h3>
            <p className="text-center text-muted-foreground mb-6">
              Your submission has been received and will be reviewed by our team.
            </p>
            <Button onClick={() => setSubmitSuccess(false)}>Submit Another Report</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            
            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL of the content <span className="text-red-500">*</span></Label>
              <Input
                id="url"
                placeholder="https://example.com/article"
                {...register('url', { 
                  required: 'URL is required',
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Please enter a valid URL'
                  }
                })}
              />
              {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title or headline</Label>
              <Input
                id="title"
                placeholder="Title of the article or post"
                {...register('title')}
              />
            </div>
            
            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="contentType">Content type <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setValue('contentType', value)} 
                defaultValue={watch('contentType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contentType && <p className="text-sm text-red-500">{errors.contentType.message}</p>}
            </div>
            
            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform">Platform <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setValue('platform', value)} 
                defaultValue={watch('platform')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && <p className="text-sm text-red-500">{errors.platform.message}</p>}
            </div>
            
            {/* Reason */}
            <div className="space-y-3">
              <Label>Reason for flagging <span className="text-red-500">*</span></Label>
              <RadioGroup 
                onValueChange={(value) => setValue('reason', value)} 
                defaultValue={watch('reason')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false_information" id="false_information" />
                  <Label htmlFor="false_information">False Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="misleading_content" id="misleading_content" />
                  <Label htmlFor="misleading_content">Misleading Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outdated_information" id="outdated_information" />
                  <Label htmlFor="outdated_information">Outdated Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manipulated_media" id="manipulated_media" />
                  <Label htmlFor="manipulated_media">Manipulated Media</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="satire_mistaken_as_news" id="satire_mistaken_as_news" />
                  <Label htmlFor="satire_mistaken_as_news">Satire Mistaken as News</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
            </div>
            
            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="details">Additional details</Label>
              <Textarea
                id="details"
                placeholder="Please provide any additional context or information about why you believe this content is fake or misleading..."
                className="min-h-[120px]"
                {...register('details')}
              />
            </div>
            
            {/* Screenshot Upload */}
            <div className="space-y-2">
              <Label htmlFor="screenshot">Upload screenshot (optional)</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop an image here, or click to select a file
                </p>
                <input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('screenshot').click()}
                >
                  Select File
                </Button>
                {selectedFile && (
                  <div className="mt-4 text-sm">
                    Selected file: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
            
            {/* Authentication Status */}
            {!isAuthenticated && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You are submitting as a guest. Creating an account allows you to track your submissions and receive updates.
                </p>
              </div>
            )}
            
            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="termsAgreed"
                onCheckedChange={(checked) => setValue('termsAgreed', checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="termsAgreed"
                  className="text-sm font-normal"
                >
                  I confirm that this report is made in good faith and the information provided is accurate to the best of my knowledge.
                </Label>
              </div>
            </div>
          </form>
        )}
      </CardContent>
      
      {!submitSuccess && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting || !watch('termsAgreed')}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SubmissionForm;

