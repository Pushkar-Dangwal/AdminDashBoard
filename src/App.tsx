import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Search, Shield, Users, Mail, List, Link2, Package, Settings, User, FileText, LayoutDashboard, Bell, Menu, Loader2 } from 'lucide-react';

// Simulated data file that would normally be fetched from API
import { fetchDashboardData, searchIntelligence } from './api-service';
import WorldMap from '@/components/WorldMap';
import MapWithTooltip from './components/MapWithToolTip';

interface DashboardData {
  stats: {
    devices: number;
    accounts: number;
    corporateEmails: number;
    combolist: number;
  };
  accountsTimelineData: { year: string; value: number }[];
  emailsTimelineData: { year: string; value: number }[];
  leakMapData?: { country: string; count: number; coordinates?: [number, number] }[];
}

const CyberDashboard = () => {
  // State to store data fetched from API
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: { devices: 0, accounts: 0, corporateEmails: 0, combolist: 0 },
    accountsTimelineData: [],
    emailsTimelineData: [],
    leakMapData: []
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  interface SearchResults {
    results: { type: string; domain: string; count: number; lastSeen: string }[];
    relatedDomains: string[];
  }
  
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const results = await searchIntelligence(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar (hidden on mobile) */}
      <div className={`w-64 border-r border-gray-800 p-4 flex-col ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-b from-blue-400 to-blue-600 w-10 h-10 rounded-md relative">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
          </div>
          <h1 className="text-lg font-bold">QUBAVE</h1>
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <div className="text-gray-500 text-sm mb-2">SEARCH TOOLS</div>
          <Button variant="ghost" className="justify-start bg-blue-900/20 text-blue-400">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <Users className="mr-2 h-4 w-4" />
            Accounts
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <Mail className="mr-2 h-4 w-4" />
            Corporate Emails
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <List className="mr-2 h-4 w-4" />
            Combolist Search
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <Link2 className="mr-2 h-4 w-4" />
            Affected URLs
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <Search className="mr-2 h-4 w-4" />
            Email Search
          </Button>

          <div className="text-gray-500 text-sm mt-6 mb-2">UNLOCKED ENTRIES</div>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <FileText className="mr-2 h-4 w-4" />
            Unlocked Items
          </Button>

          <div className="text-gray-500 text-sm mt-6 mb-2">PURCHASE</div>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <Package className="mr-2 h-4 w-4" />
            Subscription
          </Button>

          <div className="text-gray-500 text-sm mt-6 mb-2">SETTINGS</div>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button variant="ghost" className="justify-start hover:bg-gray-800">
            <FileText className="mr-2 h-4 w-4" />
            API DOC
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="flex mb-6 flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    placeholder="albawani.net"
                    className="w-full pl-10 py-5 bg-gray-800 border-gray-700 rounded-md sm:rounded-r-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button 
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-md sm:rounded-l-none px-6"
                  onClick={handleSearch}
                  disabled={searching}
                >
                  {searching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Search
                </Button>
                <Button variant="outline" className="sm:ml-4 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700">
                  Knowledge Base
                </Button>
              </div>

              {/* Search Results (if any) */}
              {searchResults && (
                <Card className="bg-gray-800 border-gray-700 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Search Results for "{searchQuery}"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {searchResults.results.map((result, idx) => (
                        <div key={idx} className="bg-gray-900 p-4 rounded-md">
                          <div className="text-gray-400 text-sm">{result.type.toUpperCase()}</div>
                          <div className="text-xl font-semibold">{result.count}</div>
                          <div className="text-gray-400 text-sm">Last seen: {result.lastSeen}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-gray-400 text-sm mb-2">Related Domains</div>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.relatedDomains.map((domain, idx) => (
                          <div key={idx} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                            {domain}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400 flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      DEVICES
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{dashboardData.stats.devices}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400 flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      ACCOUNTS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{dashboardData.stats.accounts}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400 flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      CORPORATE EMAILS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{dashboardData.stats.corporateEmails}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400 flex items-center">
                      <List className="mr-2 h-4 w-4" />
                      COMBOLIST
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{dashboardData.stats.combolist}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Map Card */}
              <Card className="bg-gray-800 border-gray-700 mb-6 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Leak Map</CardTitle>
                </CardHeader>
                <CardContent className="h-96 p-0">
                  <MapWithTooltip leakData={dashboardData.leakMapData || []} />
                </CardContent>
              </Card>

              {/* Incident Timeline Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">INCIDENT TIMELINE FOR ACCOUNTS</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.accountsTimelineData}>
                        <XAxis dataKey="year" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
                          labelStyle={{ color: '#e5e7eb' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ stroke: '#3b82f6', strokeWidth: 2, fill: '#1f2937' }}
                          activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6, fill: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">INCIDENT TIMELINE FOR CORPORATE EMAILS</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.emailsTimelineData}>
                        <XAxis dataKey="year" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
                          labelStyle={{ color: '#e5e7eb' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#ef4444" 
                          strokeWidth={2} 
                          dot={{ stroke: '#ef4444', strokeWidth: 2, fill: '#1f2937' }}
                          activeDot={{ stroke: '#ef4444', strokeWidth: 2, r: 6, fill: '#ef4444' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Alerts */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">RECENT ALERTS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-900 rounded-md border-l-4 border-yellow-500">
                      <div className="ml-2">
                        <div className="font-semibold">New combolist detected</div>
                        <div className="text-sm text-gray-400">5 hours ago • 142 accounts affected</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-900 rounded-md border-l-4 border-red-500">
                      <div className="ml-2">
                        <div className="font-semibold">Corporate email breach detected</div>
                        <div className="text-sm text-gray-400">Yesterday • 17 accounts affected</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-900 rounded-md border-l-4 border-blue-500">
                      <div className="ml-2">
                        <div className="font-semibold">Automated scan complete</div>
                        <div className="text-sm text-gray-400">2 days ago • No new vulnerabilities</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberDashboard;