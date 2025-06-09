import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, AlertTriangle, AlertCircle, Info, CheckCircle, Calendar, User, ExternalLink, Loader2 } from 'lucide-react';
import { flaggedContentApi } from '@/services/api';

const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all');
  const [verificationStatus, setVerificationStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch flagged content from API
  useEffect(() => {
    const fetchFlaggedContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('per_page', perPage);
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (contentType !== 'all') {
          params.append('content_type', contentType);
        }
        
        if (verificationStatus !== 'all') {
          params.append('verification_status', verificationStatus);
        }
        
        // Make API call
        const response = await flaggedContentApi.getAll(currentPage, perPage);
        
        // Update state with response data
        setFlaggedContent(response.items || []);
        setTotalItems(response.total || 0);
        setTotalPages(response.pages || 1);
      } catch (err) {
        console.error('Error fetching flagged content:', err);
        setError('Failed to load flagged content. Please try again later.');
        setFlaggedContent([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlaggedContent();
  }, [currentPage, perPage, searchQuery, contentType, verificationStatus]);
  
  const contentTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'News Articles' },
    { value: 'social_post', label: 'Social Media Posts' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Images' },
    { value: 'advertisement', label: 'Advertisements' }
  ];
  
  const verificationStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'verified_fake', label: 'Verified Fake' },
    { value: 'verified_misleading', label: 'Verified Misleading' },
    { value: 'verified_true', label: 'Verified True' },
    { value: 'pending', label: 'Pending Review' }
  ];
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified_fake':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Verified Fake
          </Badge>
        );
      case 'verified_misleading':
        return (
          <Badge variant="warning" className="flex items-center gap-1 bg-yellow-500">
            <AlertCircle className="h-3 w-3" />
            Misleading
          </Badge>
        );
      case 'verified_true':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-500 text-white">
            <CheckCircle className="h-3 w-3" />
            Verified True
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            Pending Review
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Browse Flagged Content</h1>
        <p className="text-xl text-muted-foreground">
          Explore content that has been flagged and verified by our community.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title or URL..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={contentType} onValueChange={(value) => {
                setContentType(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={verificationStatus} onValueChange={(value) => {
                setVerificationStatus(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {verificationStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </div>
      
      {/* Results */}
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : flaggedContent.length > 0 ? (
          <div className="space-y-6">
            {flaggedContent.map(item => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="mt-1 truncate max-w-md">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          {item.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardDescription>
                    </div>
                    {getStatusBadge(item.verification_status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">{item.content_type === 'social_post' ? 'Social Post' : item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Platform:</span>
                      <span>{item.platform}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Flagged {item.flag_count} times</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  <div className="flex flex-wrap justify-between w-full">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Added on {formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {/* First page */}
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {/* Ellipsis if needed */}
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {/* Previous page if not first */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer">
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {/* Current page */}
                  <PaginationItem>
                    <PaginationLink isActive className="cursor-pointer">
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  
                  {/* Next page if not last */}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer">
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {/* Ellipsis if needed */}
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {/* Last page */}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      
      {/* Info Box */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-muted rounded-lg">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-primary/10 rounded-full">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">How We Verify Content</h3>
            <p className="text-muted-foreground mb-4">
              Our verification process combines community input with expert review. Content is checked against reliable sources, fact-checking databases, and established journalistic standards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <h4 className="font-medium">Verified Fake</h4>
                <p className="text-sm text-muted-foreground">Content confirmed to be false or fabricated</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg">
                <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                <h4 className="font-medium">Misleading</h4>
                <p className="text-sm text-muted-foreground">Content that contains partial truths but is presented in a deceptive way</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-background rounded-lg">
                <Info className="h-8 w-8 text-blue-500 mb-2" />
                <h4 className="font-medium">Pending Review</h4>
                <p className="text-sm text-muted-foreground">Content that has been flagged but not yet verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;

