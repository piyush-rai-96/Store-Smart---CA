import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Lock,
  ChevronRight,
  Sparkles,
  Upload,
  Store,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Plus,
  Minus,
  Move,
  Target,
  TrendingUp,
  User,
  Loader2,
  Eye,
  FileText,
  Package,
  AlertCircle,
  Zap,
  RefreshCw,
  Tag,
  Wrench,
  UserPlus,
  Bot,
  Send,
  Brain,
  Camera,
  X,
  BarChart3
} from 'lucide-react';
import { useExecutionTasks, ExecutionTask as SharedExecutionTask } from '../context/ExecutionTasksContext';
import './StoreExecution.css';

// Types
type WorkflowStep = 'select' | 'upload' | 'compare' | 'tasks' | 'assign';
type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
type TaskType = 'Add' | 'Remove' | 'Move' | 'Adjust Facing';
type Priority = 'High' | 'Medium' | 'Low';

interface StoreOption {
  id: string;
  name: string;
  address: string;
  cluster: string;
}

interface LocalizedPOG {
  id: string;
  name: string;
  category: string;
  cluster: string;
  image: string;
  storeGroup: string;
}

interface DetectedSKU {
  id: string;
  name: string;
  position: string;
  shelf: number;
  facings: number;
  detected: boolean;
}

interface ExecutionTask {
  id: string;
  type: TaskType;
  skuName: string;
  skuId: string;
  fromPosition: string;
  toPosition: string;
  fromFacings?: number;
  toFacings?: number;
  priority: Priority;
  reason: string;
  impact: string;
  status: TaskStatus;
  assignedTo: string | null;
  dueDate: string | null;
  comments: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  attachment?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// Agent Chat Types
type AgentMessageType = 'welcome' | 'user' | 'agent' | 'analysis' | 'oos-alert' | 'deviation' | 'task-created' | 'processing';

interface AgentMessage {
  id: string;
  type: AgentMessageType;
  content: string;
  timestamp: Date;
  image?: string;
  analysisResult?: {
    type: 'oos' | 'deviation';
    highlights?: { x: number; y: number; width: number; height: number; label: string }[];
    deviations?: { item: string; expected: string; actual: string; severity: 'critical' | 'warning' | 'info' }[];
    oosItems?: { name: string; shelf: string; position: string }[];
  };
  processingSteps?: { step: string; status: 'pending' | 'active' | 'completed' }[];
  task?: {
    id: string;
    title: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    type: string;
  };
}

// Mock Data
const stores: StoreOption[] = [
  { id: 'store-1', name: 'Downtown Express', address: '123 Main St, New York', cluster: 'Campus Pulse' },
  { id: 'store-2', name: 'Suburban Family Mart', address: '456 Oak Ave, Brooklyn', cluster: 'Family Stock-Up' },
  { id: 'store-3', name: 'Rural Corner Store', address: '789 Country Rd, Upstate', cluster: 'Rural Core' },
];

const localizedPOGs: LocalizedPOG[] = [
  { id: 'pog-1', name: 'Beverage Cooler - Campus Pulse', category: 'Beverages', cluster: 'Campus Pulse', image: '', storeGroup: 'Campus Pulse' },
  { id: 'pog-2', name: 'Beverage Aisle - Family', category: 'Beverages', cluster: 'Family Stock-Up', image: '', storeGroup: 'Family Stock-Up' },
  { id: 'pog-3', name: 'Snacks End Cap - Rural', category: 'Snacks', cluster: 'Rural Core', image: '', storeGroup: 'Rural Core' },
];

const teamMembers: TeamMember[] = [
  { id: 'user-1', name: 'John Smith', role: 'Store Manager', avatar: 'JS' },
  { id: 'user-2', name: 'Sarah Johnson', role: 'Merchandiser', avatar: 'SJ' },
  { id: 'user-3', name: 'Mike Chen', role: 'Stock Associate', avatar: 'MC' },
  { id: 'user-4', name: 'Emily Davis', role: 'Regional Lead', avatar: 'ED' },
];

const mockDetectedSKUs: DetectedSKU[] = [
  { id: 'sku-1', name: 'Coca-Cola 20oz', position: 'Shelf 2, Slot 1', shelf: 2, facings: 2, detected: true },
  { id: 'sku-2', name: 'Pepsi 20oz', position: 'Shelf 2, Slot 3', shelf: 2, facings: 3, detected: true },
  { id: 'sku-3', name: 'Red Bull 12oz', position: 'Shelf 3, Slot 1', shelf: 3, facings: 2, detected: true },
  { id: 'sku-4', name: 'Monster Energy 16oz', position: 'Shelf 3, Slot 4', shelf: 3, facings: 1, detected: true },
  { id: 'sku-5', name: 'Dasani Water 20oz', position: 'Shelf 4, Slot 1', shelf: 4, facings: 4, detected: true },
  { id: 'sku-6', name: 'Gatorade 20oz', position: 'Not Found', shelf: 0, facings: 0, detected: false },
  { id: 'sku-7', name: 'Sprite 20oz', position: 'Not Found', shelf: 0, facings: 0, detected: false },
];

const mockTasks: ExecutionTask[] = [
  {
    id: 'task-1',
    type: 'Move',
    skuName: 'Red Bull 12oz',
    skuId: 'sku-3',
    fromPosition: 'Shelf 3, Slot 1',
    toPosition: 'Shelf 1, Slot 2',
    priority: 'High',
    reason: 'Premium visibility placement for high-impulse SKU',
    impact: 'Expected +15% sales lift based on eye-level positioning',
    status: 'Pending',
    assignedTo: null,
    dueDate: null,
    comments: [],
  },
  {
    id: 'task-2',
    type: 'Adjust Facing',
    skuName: 'Coca-Cola 20oz',
    skuId: 'sku-1',
    fromPosition: 'Shelf 2, Slot 1',
    toPosition: 'Shelf 2, Slot 1',
    fromFacings: 2,
    toFacings: 4,
    priority: 'High',
    reason: 'Increase facings to match planogram specification',
    impact: 'Reduces out-of-stock risk by 40%',
    status: 'Pending',
    assignedTo: null,
    dueDate: null,
    comments: [],
  },
  {
    id: 'task-3',
    type: 'Add',
    skuName: 'Gatorade 20oz',
    skuId: 'sku-6',
    fromPosition: 'Not in store',
    toPosition: 'Shelf 2, Slot 5',
    priority: 'Medium',
    reason: 'Missing SKU required by planogram',
    impact: 'Adds $120/week revenue potential',
    status: 'Pending',
    assignedTo: null,
    dueDate: null,
    comments: [],
  },
  {
    id: 'task-4',
    type: 'Add',
    skuName: 'Sprite 20oz',
    skuId: 'sku-7',
    fromPosition: 'Not in store',
    toPosition: 'Shelf 2, Slot 6',
    priority: 'Medium',
    reason: 'Missing SKU required by planogram',
    impact: 'Completes brand block for Coca-Cola family',
    status: 'Pending',
    assignedTo: null,
    dueDate: null,
    comments: [],
  },
  {
    id: 'task-5',
    type: 'Move',
    skuName: 'Monster Energy 16oz',
    skuId: 'sku-4',
    fromPosition: 'Shelf 3, Slot 4',
    toPosition: 'Shelf 1, Slot 4',
    priority: 'Medium',
    reason: 'Energy drinks should be grouped together at eye-level',
    impact: 'Improves category adjacency compliance',
    status: 'Pending',
    assignedTo: null,
    dueDate: null,
    comments: [],
  },
  {
    id: 'task-6',
    type: 'Adjust Facing',
    skuName: 'Dasani Water 20oz',
    skuId: 'sku-5',
    fromPosition: 'Shelf 4, Slot 1',
    toPosition: 'Shelf 4, Slot 1',
    fromFacings: 4,
    toFacings: 2,
    priority: 'Low',
    reason: 'Reduce facings to make room for premium SKUs',
    impact: 'Reallocates space to higher-margin products',
    status: 'Pending',
    assignedTo: null,
    dueDate: null,
    comments: [],
  },
];

export const StoreExecution: React.FC = () => {
  const { tasks: sharedTasks, assignTask, updateTaskStatus: updateSharedTaskStatus, teamMembers: sharedTeamMembers, addTasks } = useExecutionTasks();
  const [activeTab, setActiveTab] = useState<'agent' | 'taskList'>('agent');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('select');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedPOG, setSelectedPOG] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [detectedSKUs, setDetectedSKUs] = useState<DetectedSKU[]>([]);
  const [tasks, setTasks] = useState<ExecutionTask[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all');
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null);
  const [expandedLocalizations, setExpandedLocalizations] = useState<string[]>([]);
  const [selectedLocalization, setSelectedLocalization] = useState<string | null>(null);
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  
  // Agent Chat State
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome-1',
      type: 'welcome',
      content: '',
      timestamp: new Date()
    }
  ]);
  const [agentInput, setAgentInput] = useState('');
  const [agentImage, setAgentImage] = useState<string | null>(null);
  const [isAgentProcessing, setIsAgentProcessing] = useState(false);
  const [, setProcessingSteps] = useState<{ step: string; status: 'pending' | 'active' | 'completed' }[]>([]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat when messages change or image is uploaded
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages]);

  // Scroll input into view when image is uploaded
  useEffect(() => {
    if (agentImage) {
      // Small delay to allow DOM to update with image preview
      setTimeout(() => {
        const inputArea = document.querySelector('.agent-input-area');
        inputArea?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [agentImage]);

  const workflowSteps = [
    { id: 'select' as WorkflowStep, label: 'Select Store & POG', number: 1 },
    { id: 'upload' as WorkflowStep, label: 'Upload Layout', number: 2 },
    { id: 'compare' as WorkflowStep, label: 'Compare', number: 3 },
    { id: 'tasks' as WorkflowStep, label: 'Tasks', number: 4 },
    { id: 'assign' as WorkflowStep, label: 'Assign', number: 5 },
  ];

  const getStepStatus = (stepId: WorkflowStep): 'completed' | 'current' | 'locked' => {
    const stepOrder: WorkflowStep[] = ['select', 'upload', 'compare', 'tasks', 'assign'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'locked';
  };

  const transitionToStep = async (nextStep: WorkflowStep) => {
    setIsStepLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    setIsStepLoading(false);
    setCurrentStep(nextStep);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeLayout = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setDetectedSKUs(mockDetectedSKUs);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const generateTasks = async () => {
    setIsGeneratingTasks(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setTasks(mockTasks);
    setIsGeneratingTasks(false);
    transitionToStep('tasks');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status } : t
    ));
  };

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'Add': return <Plus size={16} />;
      case 'Remove': return <Minus size={16} />;
      case 'Move': return <Move size={16} />;
      case 'Adjust Facing': return <Target size={16} />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'In Progress': return 'in-progress';
      case 'Completed': return 'completed';
    }
  };

  const filteredTasks = tasks.filter(t => taskFilter === 'all' || t.status === taskFilter);

  const selectedStoreData = stores.find(s => s.id === selectedStore);
  const selectedPOGData = localizedPOGs.find(p => p.id === selectedPOG);

  const renderWorkflowProgress = () => (
    <div className="exec-workflow-progress">
      {workflowSteps.map((step, index) => {
        const status = getStepStatus(step.id);
        return (
          <React.Fragment key={step.id}>
            <div 
              className={`exec-workflow-step ${status}`}
              onClick={() => status === 'completed' && setCurrentStep(step.id)}
            >
              <div className="exec-workflow-step-indicator">
                {status === 'completed' ? (
                  <CheckCircle size={20} />
                ) : status === 'current' ? (
                  <Circle size={20} className="current-circle" />
                ) : (
                  <Lock size={16} />
                )}
              </div>
              <span className="exec-workflow-step-label">{step.label}</span>
            </div>
            {index < workflowSteps.length - 1 && (
              <div className={`exec-workflow-connector ${status === 'completed' ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderSelectStep = () => (
    <div className="exec-step-content">
      <h3 className="exec-step-title">Select Store & Localized POG</h3>
      <p className="exec-step-description">Choose the store and the localized planogram to execute.</p>
      
      <div className="exec-selection-grid">
        <div className="exec-selection-section">
          <h4><Store size={18} /> Select Store</h4>
          <div className="exec-store-list">
            {stores.map(store => (
              <div 
                key={store.id}
                className={`exec-store-card ${selectedStore === store.id ? 'selected' : ''}`}
                onClick={() => setSelectedStore(store.id)}
              >
                <div className="exec-store-info">
                  <h5>{store.name}</h5>
                  <p>{store.address}</p>
                  <span className="exec-store-cluster">{store.cluster}</span>
                </div>
                {selectedStore === store.id && <CheckCircle size={20} className="exec-check" />}
              </div>
            ))}
          </div>
        </div>

        <div className="exec-selection-section">
          <h4><FileText size={18} /> Select Localized POG</h4>
          <div className="exec-pog-list">
            {localizedPOGs
              .filter(pog => !selectedStore || pog.cluster === selectedStoreData?.cluster)
              .map(pog => (
                <div 
                  key={pog.id}
                  className={`exec-pog-card ${selectedPOG === pog.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPOG(pog.id)}
                >
                  <div className="exec-pog-preview">
                    {pog.image ? (
                      <img src={pog.image} alt={pog.name} />
                    ) : (
                      <div className="exec-pog-placeholder">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <div className="exec-pog-info">
                    <h5>{pog.name}</h5>
                    <span className="exec-pog-category">{pog.category}</span>
                  </div>
                  {selectedPOG === pog.id && <CheckCircle size={18} className="exec-check" />}
                </div>
              ))}
          </div>
        </div>
      </div>

      {selectedStore && selectedPOG && (
        <div className="exec-agentic-banner">
          <Zap size={18} />
          <span>Ready to compare <strong>{selectedStoreData?.name}</strong> with <strong>{selectedPOGData?.name}</strong></span>
        </div>
      )}

      <button 
        className="exec-continue-btn"
        disabled={!selectedStore || !selectedPOG}
        onClick={() => transitionToStep('upload')}
      >
        Continue to Upload <ChevronRight size={18} />
      </button>
    </div>
  );

  const renderUploadStep = () => (
    <div className="exec-step-content">
      <h3 className="exec-step-title">Upload Current Store Layout</h3>
      <p className="exec-step-description">Upload a photo or layout file of the current shelf arrangement.</p>
      
      <div className="exec-upload-area">
        {!uploadedImage ? (
          <>
            <label className="exec-upload-dropzone">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <Upload size={48} />
              <h4>Drop image here or click to upload</h4>
              <p>Supports JPG, PNG, HEIC up to 10MB</p>
            </label>
            <div className="exec-sample-option">
              <span>Don't have an image?</span>
              <button 
                className="exec-use-sample-btn"
                onClick={() => setUploadedImage('sample')}
              >
                <Package size={16} />
                Use Sample Layout
              </button>
            </div>
          </>
        ) : (
          <div className="exec-uploaded-preview">
            {uploadedImage === 'sample' ? (
              <div className="exec-sample-layout">
                <div className="exec-sample-header">Current Store Layout - Beverage Section</div>
                <div className="exec-sample-shelf shelf-1">
                  <span className="shelf-label">Shelf 1</span>
                  <div className="shelf-products">
                    <div className="product energy">Red Bull</div>
                    <div className="product energy">Monster</div>
                    <div className="product energy">Rockstar</div>
                  </div>
                </div>
                <div className="exec-sample-shelf shelf-2">
                  <span className="shelf-label">Shelf 2</span>
                  <div className="shelf-products">
                    <div className="product cola">Coca-Cola</div>
                    <div className="product cola">Coca-Cola</div>
                    <div className="product cola">Pepsi</div>
                    <div className="product cola">Pepsi</div>
                    <div className="product cola">Pepsi</div>
                  </div>
                </div>
                <div className="exec-sample-shelf shelf-3">
                  <span className="shelf-label">Shelf 3</span>
                  <div className="shelf-products">
                    <div className="product sports">Gatorade</div>
                    <div className="product sports">Powerade</div>
                    <div className="product empty">Empty</div>
                  </div>
                </div>
                <div className="exec-sample-shelf shelf-4">
                  <span className="shelf-label">Shelf 4</span>
                  <div className="shelf-products">
                    <div className="product water">Dasani</div>
                    <div className="product water">Dasani</div>
                    <div className="product water">Dasani</div>
                    <div className="product water">Dasani</div>
                  </div>
                </div>
              </div>
            ) : (
              <img src={uploadedImage} alt="Uploaded layout" />
            )}
            <button className="exec-remove-image" onClick={() => {
              setUploadedImage(null);
              setAnalysisComplete(false);
              setDetectedSKUs([]);
            }}>
              Remove
            </button>
          </div>
        )}
      </div>

      {uploadedImage && !analysisComplete && (
        <button 
          className="exec-analyze-btn"
          onClick={analyzeLayout}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={18} className="spinning" />
              Analyzing Layout...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze with AI
            </>
          )}
        </button>
      )}

      {isAnalyzing && (
        <div className="exec-analysis-status">
          <div className="exec-analysis-step active">
            <Loader2 size={16} className="spinning" />
            <span>Analyzing current shelf layout...</span>
          </div>
          <div className="exec-analysis-step">
            <Circle size={16} />
            <span>Detecting SKU placement and facings...</span>
          </div>
          <div className="exec-analysis-step">
            <Circle size={16} />
            <span>Extracting position data...</span>
          </div>
        </div>
      )}

      {analysisComplete && (
        <div className="exec-detection-results">
          <div className="exec-detection-header">
            <CheckCircle size={20} />
            <h4>Analysis Complete</h4>
          </div>
          <div className="exec-detection-summary">
            <div className="exec-detection-stat">
              <span className="exec-stat-value">{detectedSKUs.filter(s => s.detected).length}</span>
              <span className="exec-stat-label">SKUs Detected</span>
            </div>
            <div className="exec-detection-stat warning">
              <span className="exec-stat-value">{detectedSKUs.filter(s => !s.detected).length}</span>
              <span className="exec-stat-label">Missing SKUs</span>
            </div>
          </div>
          <div className="exec-detected-list">
            {detectedSKUs.map(sku => (
              <div key={sku.id} className={`exec-detected-item ${!sku.detected ? 'missing' : ''}`}>
                <span className="exec-sku-name">{sku.name}</span>
                <span className="exec-sku-position">{sku.position}</span>
                {sku.detected && <span className="exec-sku-facings">{sku.facings} facings</span>}
                {!sku.detected && <AlertTriangle size={14} className="exec-missing-icon" />}
              </div>
            ))}
          </div>
          
          <button className="exec-continue-btn" onClick={() => transitionToStep('compare')}>
            Continue to Comparison <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const renderCompareStep = () => (
    <div className="exec-step-content">
      <h3 className="exec-step-title">Compare Current vs Localized POG</h3>
      <p className="exec-step-description">Review the differences between current store layout and target planogram.</p>
      
      <div className="exec-comparison-view">
        <div className="exec-compare-panel">
          <div className="exec-compare-header">
            <h4>Current Store Layout</h4>
            <span className="exec-compare-badge current">Detected</span>
          </div>
          <div className="exec-compare-image">
            {uploadedImage === 'sample' ? (
              <div className="exec-sample-layout compact">
                <div className="exec-sample-shelf shelf-1">
                  <span className="shelf-label">Shelf 1</span>
                  <div className="shelf-products">
                    <div className="product energy">Red Bull</div>
                    <div className="product energy">Monster</div>
                  </div>
                </div>
                <div className="exec-sample-shelf shelf-2">
                  <span className="shelf-label">Shelf 2</span>
                  <div className="shelf-products">
                    <div className="product cola">Coca-Cola</div>
                    <div className="product cola">Pepsi</div>
                  </div>
                </div>
                <div className="exec-sample-shelf shelf-3">
                  <span className="shelf-label">Shelf 3</span>
                  <div className="shelf-products">
                    <div className="product water">Dasani</div>
                    <div className="product water">Dasani</div>
                  </div>
                </div>
              </div>
            ) : uploadedImage ? (
              <img src={uploadedImage} alt="Current layout" />
            ) : null}
          </div>
        </div>
        
        <div className="exec-compare-divider">
          <ArrowRight size={24} />
        </div>
        
        <div className="exec-compare-panel">
          <div className="exec-compare-header">
            <h4>Localized Planogram</h4>
            <span className="exec-compare-badge target">Target</span>
          </div>
          <div className="exec-compare-image">
            <div className="exec-pog-target-layout">
              <div className="exec-sample-shelf shelf-1">
                <span className="shelf-label">Shelf 1</span>
                <div className="shelf-products">
                  <div className="product energy">Red Bull</div>
                  <div className="product energy">Monster</div>
                  <div className="product energy">Rockstar</div>
                </div>
              </div>
              <div className="exec-sample-shelf shelf-2">
                <span className="shelf-label">Shelf 2</span>
                <div className="shelf-products">
                  <div className="product cola">Coca-Cola</div>
                  <div className="product cola">Coca-Cola</div>
                  <div className="product cola">Pepsi</div>
                  <div className="product sports">Gatorade</div>
                  <div className="product sports">Sprite</div>
                </div>
              </div>
              <div className="exec-sample-shelf shelf-3">
                <span className="shelf-label">Shelf 3</span>
                <div className="shelf-products">
                  <div className="product water">Dasani</div>
                  <div className="product water">Dasani</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="exec-mismatch-summary">
        <div className="exec-mismatch-header">
          <AlertCircle size={20} />
          <h4>Mismatch Analysis</h4>
        </div>
        <div className="exec-mismatch-grid">
          <div className="exec-mismatch-card">
            <span className="exec-mismatch-value">12</span>
            <span className="exec-mismatch-label">Total Mismatches</span>
          </div>
          <div className="exec-mismatch-card warning">
            <span className="exec-mismatch-value">4</span>
            <span className="exec-mismatch-label">Missing SKUs</span>
          </div>
          <div className="exec-mismatch-card info">
            <span className="exec-mismatch-value">6</span>
            <span className="exec-mismatch-label">Facing Adjustments</span>
          </div>
          <div className="exec-mismatch-card">
            <span className="exec-mismatch-value">2</span>
            <span className="exec-mismatch-label">Position Changes</span>
          </div>
        </div>
      </div>

      <div className="exec-agentic-insights">
        <div className="exec-insights-header">
          <Sparkles size={18} />
          <h4>AI Insights</h4>
        </div>
        <div className="exec-insights-list">
          <div className="exec-insight-item">
            <AlertTriangle size={16} />
            <span>Energy drinks are not at eye-level — expected 23% lower conversion</span>
          </div>
          <div className="exec-insight-item">
            <AlertTriangle size={16} />
            <span>Coca-Cola facings below minimum — high out-of-stock risk</span>
          </div>
          <div className="exec-insight-item">
            <TrendingUp size={16} />
            <span>Fixing all mismatches will improve compliance by 85%</span>
          </div>
        </div>
      </div>

      <button 
        className="exec-generate-btn"
        onClick={generateTasks}
        disabled={isGeneratingTasks}
      >
        {isGeneratingTasks ? (
          <>
            <Loader2 size={18} className="spinning" />
            Generating Tasks...
          </>
        ) : (
          <>
            <Zap size={18} />
            Generate Execution Tasks
          </>
        )}
      </button>
    </div>
  );

  const renderTasksStep = () => (
    <div className="exec-step-content">
      <h3 className="exec-step-title">Auto-Generated Execution Tasks</h3>
      <p className="exec-step-description">Review AI-generated tasks to bring the store into compliance.</p>
      
      <div className="exec-tasks-summary">
        <div className="exec-task-count">
          <Package size={20} />
          <span><strong>{tasks.length}</strong> tasks generated</span>
        </div>
        <div className="exec-priority-breakdown">
          <span className="exec-priority-tag high">{tasks.filter(t => t.priority === 'High').length} High</span>
          <span className="exec-priority-tag medium">{tasks.filter(t => t.priority === 'Medium').length} Medium</span>
          <span className="exec-priority-tag low">{tasks.filter(t => t.priority === 'Low').length} Low</span>
        </div>
      </div>

      <div className="exec-tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="exec-task-card">
            <div className="exec-task-header">
              <div className="exec-task-type-badge" data-type={task.type.toLowerCase().replace(' ', '-')}>
                {getTaskTypeIcon(task.type)}
                <span>{task.type}</span>
              </div>
              <span className={`exec-task-priority ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <div className="exec-task-content">
              <h5>{task.skuName}</h5>
              <div className="exec-task-positions">
                <span className="exec-from">{task.fromPosition}</span>
                <ArrowRight size={14} />
                <span className="exec-to">{task.toPosition}</span>
                {task.fromFacings !== undefined && (
                  <span className="exec-facings">
                    ({task.fromFacings} → {task.toFacings} facings)
                  </span>
                )}
              </div>
            </div>

            <div className="exec-task-reason">
              <Sparkles size={14} />
              <span>{task.reason}</span>
            </div>

            <div className="exec-task-impact">
              <TrendingUp size={14} />
              <span>{task.impact}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="exec-continue-btn" onClick={() => transitionToStep('assign')}>
        Continue to Assignment <ChevronRight size={18} />
      </button>
    </div>
  );

  const [overallAssignee, setOverallAssignee] = useState<string | null>(null);
  const [overallDueDate, setOverallDueDate] = useState<string | null>(null);

  const applyOverallAssignment = () => {
    setTasks(prev => prev.map(t => ({
      ...t,
      assignedTo: overallAssignee,
      dueDate: overallDueDate
    })));
  };

  const renderAssignStep = () => (
    <div className="exec-step-content">
      <h3 className="exec-step-title">Assign Execution to Team</h3>
      <p className="exec-step-description">Assign the entire execution task set to a team member.</p>
      
      {/* Execution Summary Card */}
      <div className="exec-assignment-summary-card">
        <div className="exec-assignment-header">
          <div className="exec-assignment-icon">
            <Package size={24} />
          </div>
          <div className="exec-assignment-info">
            <h4>{selectedPOGData?.name || 'Localized POG'}</h4>
            <p>Execution for <strong>{selectedStoreData?.name}</strong></p>
          </div>
        </div>
        
        <div className="exec-assignment-stats">
          <div className="exec-stat-box">
            <span className="exec-stat-number">{tasks.length}</span>
            <span className="exec-stat-text">Total Tasks</span>
          </div>
          <div className="exec-stat-box high">
            <span className="exec-stat-number">{tasks.filter(t => t.priority === 'High').length}</span>
            <span className="exec-stat-text">High Priority</span>
          </div>
          <div className="exec-stat-box medium">
            <span className="exec-stat-number">{tasks.filter(t => t.priority === 'Medium').length}</span>
            <span className="exec-stat-text">Medium</span>
          </div>
          <div className="exec-stat-box low">
            <span className="exec-stat-number">{tasks.filter(t => t.priority === 'Low').length}</span>
            <span className="exec-stat-text">Low</span>
          </div>
        </div>

        <div className="exec-task-preview-list">
          <h5>Tasks Included:</h5>
          <div className="exec-task-chips">
            {tasks.map(task => (
              <div key={task.id} className="exec-task-chip" data-type={task.type.toLowerCase().replace(' ', '-')}>
                {getTaskTypeIcon(task.type)}
                <span>{task.skuName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Assignment Form */}
      <div className="exec-overall-assignment">
        <h4>Assignment Details</h4>
        <div className="exec-overall-fields">
          <div className="exec-assign-field large">
            <label><User size={16} /> Assign To</label>
            <select 
              value={overallAssignee || ''}
              onChange={(e) => setOverallAssignee(e.target.value || null)}
            >
              <option value="">Select team member</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name} - {member.role}</option>
              ))}
            </select>
          </div>
          <div className="exec-assign-field large">
            <label><Calendar size={16} /> Due Date</label>
            <input 
              type="date"
              value={overallDueDate || ''}
              onChange={(e) => setOverallDueDate(e.target.value || null)}
            />
          </div>
        </div>
      </div>

      <button 
        className="exec-continue-btn"
        disabled={!overallAssignee}
        onClick={() => {
          applyOverallAssignment();
          setActiveTab('taskList');
        }}
      >
        Assign & Go to Task List <ChevronRight size={18} />
      </button>
    </div>
  );

  // Combined tasks from shared context and local workflow
  const allTasks = [...sharedTasks, ...tasks];
  // Filter tasks by status and localization
  const _filteredAllTasks = allTasks.filter(t => {
    const statusMatch = taskFilter === 'all' || t.status === taskFilter;
    const locMatch = !selectedLocalization || ('localizationId' in t && t.localizationId === selectedLocalization);
    return statusMatch && locMatch;
  });
  void _filteredAllTasks; // Used in grouped view

  // Group shared tasks by localization ID
  const tasksByLocalization = sharedTasks.reduce((acc, task) => {
    const locId = task.localizationId;
    if (!acc[locId]) {
      acc[locId] = {
        id: locId,
        pogName: task.pogName,
        storeGroup: task.storeGroup,
        category: task.category,
        createdAt: task.createdAt,
        tasks: []
      };
    }
    acc[locId].tasks.push(task);
    return acc;
  }, {} as Record<string, { id: string; pogName: string; storeGroup: string; category: string; createdAt: string; tasks: SharedExecutionTask[] }>);

  const localizationGroups = Object.values(tasksByLocalization);

  const toggleLocalizationExpand = (locId: string) => {
    setExpandedLocalizations(prev => 
      prev.includes(locId) ? prev.filter(id => id !== locId) : [...prev, locId]
    );
  };

  const getSharedTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'Add': return <Plus size={16} />;
      case 'Remove': return <Minus size={16} />;
      case 'Move': return <Move size={16} />;
      case 'Adjust Facing': return <Target size={16} />;
      case 'Reset Shelf': return <RefreshCw size={16} />;
      case 'Update Label': return <Tag size={16} />;
      case 'Install Fixture': return <Wrench size={16} />;
      default: return <Package size={16} />;
    }
  };

  const handleAssignTask = (taskId: string, memberId: string) => {
    const member = sharedTeamMembers.find(m => m.id === memberId);
    if (member) {
      assignTask(taskId, memberId, member.name);
    }
    setAssigningTaskId(null);
  };

  const renderTaskListTab = () => (
    <div className="exec-task-list-view">
      <div className="exec-task-list-header">
        <h3>All Execution Tasks</h3>
        <div className="exec-task-list-filters">
          <button 
            className={`exec-filter-btn ${taskFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTaskFilter('all')}
          >
            All ({allTasks.length})
          </button>
          <button 
            className={`exec-filter-btn ${taskFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => setTaskFilter('Pending')}
          >
            Pending ({allTasks.filter(t => t.status === 'Pending').length})
          </button>
          <button 
            className={`exec-filter-btn ${taskFilter === 'In Progress' ? 'active' : ''}`}
            onClick={() => setTaskFilter('In Progress')}
          >
            In Progress ({allTasks.filter(t => t.status === 'In Progress').length})
          </button>
          <button 
            className={`exec-filter-btn ${taskFilter === 'Completed' ? 'active' : ''}`}
            onClick={() => setTaskFilter('Completed')}
          >
            Completed ({allTasks.filter(t => t.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* Localization Filter Dropdown */}
      {localizationGroups.length > 0 && (
        <div className="exec-localization-filter">
          <label>Filter by Localization:</label>
          <div className="exec-loc-dropdown">
            <button 
              className={`exec-loc-dropdown-trigger ${isLocDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
            >
              <span className="exec-loc-dropdown-value">
                {selectedLocalization 
                  ? `${localizationGroups.find(l => l.id === selectedLocalization)?.pogName} → ${localizationGroups.find(l => l.id === selectedLocalization)?.storeGroup}`
                  : `All Localizations (${localizationGroups.length})`
                }
              </span>
              <ChevronRight size={16} className={`exec-loc-dropdown-icon ${isLocDropdownOpen ? 'rotated' : ''}`} />
            </button>
            {isLocDropdownOpen && (
              <div className="exec-loc-dropdown-menu">
                <div 
                  className={`exec-loc-dropdown-item ${!selectedLocalization ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedLocalization(null);
                    setIsLocDropdownOpen(false);
                  }}
                >
                  <div className="exec-loc-dropdown-item-content">
                    <span className="exec-loc-dropdown-item-title">All Localizations</span>
                    <span className="exec-loc-dropdown-item-count">{localizationGroups.length} groups</span>
                  </div>
                  {!selectedLocalization && <CheckCircle size={16} className="exec-loc-dropdown-check" />}
                </div>
                {localizationGroups.map(loc => (
                  <div 
                    key={loc.id}
                    className={`exec-loc-dropdown-item ${selectedLocalization === loc.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedLocalization(loc.id);
                      setIsLocDropdownOpen(false);
                    }}
                  >
                    <div className="exec-loc-dropdown-item-content">
                      <span className="exec-loc-dropdown-item-title">{loc.pogName} → {loc.storeGroup}</span>
                      <div className="exec-loc-dropdown-item-meta">
                        <span className="exec-loc-dropdown-tag">{loc.category}</span>
                        <span className="exec-loc-dropdown-item-count">{loc.tasks.length} tasks</span>
                      </div>
                    </div>
                    {selectedLocalization === loc.id && <CheckCircle size={16} className="exec-loc-dropdown-check" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {allTasks.length === 0 ? (
        <div className="exec-no-tasks">
          <Package size={48} />
          <h4>No Tasks Yet</h4>
          <p>Complete the execution workflow to generate tasks.</p>
          <button className="exec-go-workflow-btn" onClick={() => setActiveTab('agent')}>
            Go to ShelfIQ Agent
          </button>
        </div>
      ) : (
        <div className="exec-localization-groups">
          {localizationGroups.map(locGroup => {
            const isExpanded = expandedLocalizations.includes(locGroup.id) || expandedLocalizations.length === 0;
            const groupTasks = locGroup.tasks.filter(t => taskFilter === 'all' || t.status === taskFilter);
            const pendingCount = locGroup.tasks.filter(t => t.status === 'Pending').length;
            const inProgressCount = locGroup.tasks.filter(t => t.status === 'In Progress').length;
            const completedCount = locGroup.tasks.filter(t => t.status === 'Completed').length;

            if (selectedLocalization && selectedLocalization !== locGroup.id) return null;
            if (groupTasks.length === 0) return null;

            return (
              <div key={locGroup.id} className="exec-loc-group">
                <div 
                  className={`exec-loc-group-header ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleLocalizationExpand(locGroup.id)}
                >
                  <div className="exec-loc-group-info">
                    <ChevronRight size={18} className={`exec-loc-chevron ${isExpanded ? 'rotated' : ''}`} />
                    <div className="exec-loc-group-details">
                      <h4>{locGroup.pogName} <ArrowRight size={14} /> {locGroup.storeGroup}</h4>
                      <div className="exec-loc-group-meta">
                        <span className="exec-loc-tag category">{locGroup.category}</span>
                        <span className="exec-loc-tag date">
                          <Calendar size={12} />
                          {new Date(locGroup.createdAt).toLocaleDateString()}
                        </span>
                        <span className="exec-loc-id">ID: {locGroup.id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="exec-loc-group-stats">
                    <span className="exec-stat pending">{pendingCount} Pending</span>
                    <span className="exec-stat in-progress">{inProgressCount} In Progress</span>
                    <span className="exec-stat completed">{completedCount} Completed</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="exec-task-cards">
                    {groupTasks.map(task => {
                      const assignee = sharedTeamMembers.find(m => m.id === task.assignedTo);
                      
                      return (
                        <div key={task.id} className={`exec-task-card ${task.status.toLowerCase().replace(' ', '-')}`}>
                          <div className="exec-task-card-header">
                            <div className="exec-task-type-badge" data-type={task.type.toLowerCase().replace(' ', '-')}>
                              {getSharedTaskTypeIcon(task.type)}
                              <span>{task.type}</span>
                            </div>
                            <div className={`exec-task-priority ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </div>
                          </div>
                          
                          <h4 className="exec-task-card-title">{task.title}</h4>
                          
                          <p className="exec-task-card-desc">{task.description}</p>

                          <div className="exec-task-card-meta">
                            <span className="exec-task-meta-item">
                              <Store size={14} />
                              {task.storeName}
                            </span>
                            <span className="exec-task-meta-item">
                              <FileText size={14} />
                              {task.pogName}
                            </span>
                          </div>

                          <div className="exec-task-card-impact">
                            <TrendingUp size={14} />
                            <span>{task.impact}</span>
                          </div>

                          <div className="exec-task-card-footer">
                            <div className="exec-task-assignee-section">
                              {assigningTaskId === task.id ? (
                                <select 
                                  className="exec-assign-select"
                                  onChange={(e) => handleAssignTask(task.id, e.target.value)}
                                  defaultValue=""
                                >
                                  <option value="" disabled>Select team member</option>
                                  {sharedTeamMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                      {member.name} - {member.role}
                                    </option>
                                  ))}
                                </select>
                              ) : assignee ? (
                                <div className="exec-assignee-chip" onClick={() => setAssigningTaskId(task.id)}>
                                  <span className="exec-avatar small">{assignee.avatar}</span>
                                  <span>{assignee.name}</span>
                                </div>
                              ) : (
                                <button 
                                  className="exec-assign-btn"
                                  onClick={() => setAssigningTaskId(task.id)}
                                >
                                  <UserPlus size={14} />
                                  Assign
                                </button>
                              )}
                            </div>
                            
                            <select 
                              className={`exec-status-select ${getStatusColor(task.status)}`}
                              value={task.status}
                              onChange={(e) => updateSharedTaskStatus(task.id, e.target.value as TaskStatus)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Show workflow tasks separately if any */}
          {tasks.length > 0 && (
            <div className="exec-loc-group">
              <div className="exec-loc-group-header expanded">
                <div className="exec-loc-group-info">
                  <div className="exec-loc-group-details">
                    <h4>Workflow Generated Tasks</h4>
                    <div className="exec-loc-group-meta">
                      <span className="exec-loc-tag category">Store Execution</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="exec-task-cards">
                {filteredTasks.map(task => {
                  const assignee = teamMembers.find(m => m.id === task.assignedTo);
                  
                  return (
                    <div key={task.id} className={`exec-task-card ${task.status.toLowerCase().replace(' ', '-')}`}>
                      <div className="exec-task-card-header">
                        <div className="exec-task-type-badge" data-type={task.type.toLowerCase().replace(' ', '-')}>
                          {getTaskTypeIcon(task.type)}
                          <span>{task.type}</span>
                        </div>
                        <div className={`exec-task-priority ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </div>
                      </div>
                      
                      <h4 className="exec-task-card-title">{task.type}: {task.skuName}</h4>
                      
                      <p className="exec-task-card-desc">{task.reason}</p>

                      <div className="exec-task-card-impact">
                        <TrendingUp size={14} />
                        <span>{task.impact}</span>
                      </div>

                      <div className="exec-task-card-footer">
                        <div className="exec-task-assignee-section">
                          {assignee ? (
                            <div className="exec-assignee-chip">
                              <span className="exec-avatar small">{assignee.avatar}</span>
                              <span>{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="exec-unassigned">Unassigned</span>
                          )}
                        </div>
                        
                        <select 
                          className={`exec-status-select ${getStatusColor(task.status)}`}
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Agent Chat Handlers
  const handleAgentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAgentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAgentProcessing = async (type: 'oos' | 'deviation', uploadedImage: string | null) => {
    setIsAgentProcessing(true);
    
    const steps = type === 'oos' ? [
      { step: 'Receiving shelf image...', status: 'active' as const },
      { step: 'AI Agent reviewing image...', status: 'pending' as const },
      { step: 'Scanning for empty shelf positions...', status: 'pending' as const },
      { step: 'Cross-referencing with Holiday Decor planogram...', status: 'pending' as const },
      { step: 'Identifying out-of-stock products...', status: 'pending' as const },
      { step: 'Generating OOS detection overlay...', status: 'pending' as const },
    ] : [
      { step: 'Scanning uploaded planogram...', status: 'active' as const },
      { step: 'Matching with localized POG library...', status: 'pending' as const },
      { step: 'Analyzing product placement...', status: 'pending' as const },
      { step: 'Detecting deviations...', status: 'pending' as const },
      { step: 'Calculating compliance score...', status: 'pending' as const },
    ];
    
    setProcessingSteps(steps);

    // Add processing message
    const processingMsg: AgentMessage = {
      id: `proc-${Date.now()}`,
      type: 'processing',
      content: type === 'oos' ? '🤖 ShelfIQ Agent is analyzing your shelf image...' : 'Comparing with localized planogram...',
      timestamp: new Date(),
      processingSteps: steps
    };
    setAgentMessages(prev => [...prev, processingMsg]);

    // Simulate step-by-step processing
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      setProcessingSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx < i + 1 ? 'completed' : idx === i + 1 ? 'active' : 'pending'
      })));
      setAgentMessages(prev => prev.map(m => 
        m.id === processingMsg.id ? {
          ...m,
          processingSteps: m.processingSteps?.map((s, idx) => ({
            ...s,
            status: idx <= i ? 'completed' : idx === i + 1 ? 'active' : 'pending'
          }))
        } : m
      ));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAgentProcessing(false);

    // Generate result based on type
    if (type === 'oos') {
      // Home Decor OOS Detection - use the detected image
      const oosResult: AgentMessage = {
        id: `oos-${Date.now()}`,
        type: 'oos-alert',
        content: '🚨 **Critical Out-of-Stock Alert!**\n\n**2026 Dollar General Holiday Decor Planogram**\n\nI detected **5 out-of-stock positions** requiring immediate replenishment:',
        timestamp: new Date(),
        image: '/home-decor-oos-detected.png', // Show the annotated OOS image
        analysisResult: {
          type: 'oos',
          oosItems: [
            { name: 'Red/Gold/Green Mini Ornaments', shelf: 'Shelf 2', position: 'Bay Section' },
            { name: 'Green Stick Candles', shelf: 'Shelf 3', position: 'Center Position' },
            { name: 'Red/Silver Mini Ornaments', shelf: 'Shelf 3', position: 'Left Section' },
            { name: 'Multi-Color Mini Ornaments', shelf: 'Shelf 3', position: 'Right Section' },
            { name: 'Entire Bay - Holiday Hooks', shelf: 'Shelf 1', position: 'Full Bay Empty' },
          ],
          highlights: []
        },
        task: {
          id: `task-oos-${Date.now()}`,
          title: 'Holiday Decor Critical OOS - Immediate Replenishment',
          priority: 'Critical',
          type: 'Replenish Stock'
        }
      };
      setAgentMessages(prev => [...prev.filter(m => m.id !== processingMsg.id), oosResult]);
    } else {
      const deviationResult: AgentMessage = {
        id: `dev-${Date.now()}`,
        type: 'deviation',
        content: '',
        timestamp: new Date(),
        image: uploadedImage || undefined,
        analysisResult: {
          type: 'deviation',
          deviations: [
            { item: 'Monster Energy (Green)', expected: 'Shelf 1, Position 1-4 (4 facings)', actual: 'Shelf 2, Position 3-4 (2 facings)', severity: 'critical' },
            { item: 'Red Bull Original', expected: 'Shelf 1, Position 5-8 (4 facings)', actual: 'Shelf 1, Position 1-2 (2 facings)', severity: 'critical' },
            { item: 'Coca-Cola Classic 20oz', expected: 'Shelf 2, Position 1-6 (6 facings)', actual: 'Shelf 3, Position 1-4 (4 facings)', severity: 'warning' },
            { item: 'Pepsi 20oz', expected: 'Shelf 2, Position 7-10', actual: 'Missing from shelf', severity: 'critical' },
            { item: 'Gatorade Fruit Punch', expected: 'Shelf 3, Position 1-4', actual: 'Shelf 3, Position 5-8 (Correct zone)', severity: 'info' },
            { item: 'Dasani Water 20oz', expected: 'Shelf 4, Position 1-8', actual: 'Shelf 4, Position 1-6 (2 facings short)', severity: 'warning' },
          ]
        },
        task: {
          id: `task-dev-${Date.now()}`,
          title: 'Beverage End Cap - Compliance Reset Required',
          priority: 'High',
          type: 'Reset Shelf'
        }
      };
      setAgentMessages(prev => [...prev.filter(m => m.id !== processingMsg.id), deviationResult]);
    }

    setAgentImage(null);
  };

  const handleAgentSubmit = () => {
    if (!agentInput.trim() && !agentImage) return;

    // Add user message
    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: agentInput || 'Uploaded image for analysis',
      timestamp: new Date(),
      image: agentImage || undefined
    };
    setAgentMessages(prev => [...prev, userMsg]);

    // Determine analysis type based on input
    const input = agentInput.toLowerCase();
    const currentImage = agentImage;
    if (currentImage) {
      // Default to OOS detection for any image upload
      if (input.includes('deviation') || input.includes('compliance') || input.includes('compare')) {
        simulateAgentProcessing('deviation', currentImage);
      } else {
        // Default to OOS detection
        simulateAgentProcessing('oos', currentImage);
      }
    } else {
      // Text-only response
      const agentResponse: AgentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: 'I can help you analyze shelf images! Please upload a photo of your store shelf and I\'ll detect:\n\n• **Out-of-Stock items** - Empty shelf positions that need replenishment\n• **Planogram Deviations** - Products placed incorrectly vs. the localized POG\n\nJust upload an image and tell me what you\'d like me to check!',
        timestamp: new Date()
      };
      setAgentMessages(prev => [...prev, agentResponse]);
    }

    setAgentInput('');
    setAgentImage(null); // Clear image after sending
  };

  const handleCreateTask = (task: { id: string; title: string; priority: string; type: string }) => {
    // Map agent task types to valid TaskType
    const typeMap: Record<string, 'Add' | 'Remove' | 'Move' | 'Adjust Facing' | 'Reset Shelf' | 'Update Label' | 'Install Fixture'> = {
      'Replenish Stock': 'Add',
      'Reset Shelf': 'Reset Shelf',
      'Move Products': 'Move',
      'Adjust Facings': 'Adjust Facing',
      'Update Labels': 'Update Label',
    };
    
    // Map priority - Critical maps to High since Priority type doesn't include Critical
    const priorityMap: Record<string, 'High' | 'Medium' | 'Low'> = {
      'Critical': 'High',
      'High': 'High',
      'Medium': 'Medium',
      'Low': 'Low',
    };

    // Determine if this is an OOS task
    const isOOSTask = task.type === 'Replenish Stock' || task.title.includes('OOS');
    const localizationId = isOOSTask ? 'oos-tasks' : `agent-${Date.now()}`;

    const newTask: SharedExecutionTask = {
      id: task.id,
      type: typeMap[task.type] || 'Reset Shelf',
      title: task.title,
      description: isOOSTask 
        ? 'Critical out-of-stock items detected by ShelfIQ Agent. Immediate replenishment required to prevent lost sales.'
        : 'Auto-generated by ShelfIQ Agent based on shelf analysis',
      priority: priorityMap[task.priority] || 'High',
      reason: isOOSTask 
        ? 'AI-detected empty shelf positions causing lost sales opportunity'
        : 'Detected via AI-powered shelf analysis',
      impact: isOOSTask
        ? 'Critical: Empty shelves directly impact customer experience and revenue'
        : 'Improves shelf compliance and reduces lost sales',
      status: 'Pending' as const,
      assignedTo: null,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      storeName: 'Dollar General #1247',
      storeGroup: 'Holiday Seasonal',
      pogName: '2026 Holiday Decor Planogram',
      category: isOOSTask ? 'Out of Stock' : 'Compliance',
      createdAt: new Date().toISOString(),
      localizationId: localizationId
    };
    
    addTasks([newTask]);
    
    // Add confirmation message
    const confirmMsg: AgentMessage = {
      id: `confirm-${Date.now()}`,
      type: 'task-created',
      content: isOOSTask 
        ? `✅ **OOS Task Created!**\n\n"${task.title}" has been added to the **Out of Stock** bucket in your Task List.\n\n⚡ This task requires immediate attention to prevent lost sales.`
        : `✅ **Task Created Successfully!**\n\n"${task.title}" has been added to your Task List with **${task.priority}** priority.`,
      timestamp: new Date()
    };
    setAgentMessages(prev => [...prev, confirmMsg]);
  };

  // Check if chat has started (more than just welcome message)
  const hasConversationStarted = agentMessages.length > 1 || agentMessages.some(m => m.type !== 'welcome');

  const renderAgentChat = () => (
    <div className={`agent-chat-container ${hasConversationStarted ? 'chat-active' : ''}`}>
      <div className="agent-chat-messages">
        {agentMessages.map(msg => (
          <div key={msg.id} className={`agent-message ${msg.type}`}>
            {msg.type === 'welcome' && !hasConversationStarted && (
              <div className="agent-welcome-premium">
                <div className="welcome-gradient-bg"></div>
                <div className="welcome-content">
                  <div className="agent-icon-container">
                    <div className="agent-icon-glow"></div>
                    <div className="agent-welcome-icon-premium">
                      <Brain size={32} />
                    </div>
                    <div className="agent-status-badge">
                      <span className="status-dot"></span>
                      Ready
                    </div>
                  </div>
                  
                  <h2>ShelfIQ Agent</h2>
                  <p className="welcome-subtitle">Your AI-powered retail intelligence partner</p>
                  
                  <p className="welcome-hint">Upload a shelf image to detect OOS, check compliance, or create tasks</p>
                  
                  <div className="suggestion-chips">
                    <span className="suggestion-label">Try:</span>
                    <button 
                      className="suggestion-chip"
                      onClick={() => setAgentInput('Detect out-of-stock items in my shelf image')}
                    >
                      🔍 Detect OOS items
                    </button>
                    <button 
                      className="suggestion-chip"
                      onClick={() => setAgentInput('Check POG compliance for this shelf')}
                    >
                      ✓ Check compliance
                    </button>
                  </div>
                </div>
              </div>
            )}

            {msg.type === 'user' && (
              <div className="agent-user-message">
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <div className="user-content">
                  {msg.image && (
                    <div 
                      className="user-image-thumbnail"
                      onClick={() => setExpandedImage(msg.image || null)}
                    >
                      <img src={msg.image} alt="Uploaded" />
                      <div className="user-image-expand">
                        <Eye size={14} />
                      </div>
                    </div>
                  )}
                  {msg.content && <p>{msg.content}</p>}
                </div>
              </div>
            )}

            {msg.type === 'agent' && (
              <div className="agent-response">
                <div className="agent-avatar">
                  <Bot size={18} />
                </div>
                <div className="agent-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
                </div>
              </div>
            )}

            {msg.type === 'processing' && (
              <div className="agent-processing-premium">
                <div className="processing-header">
                  <div className="processing-spinner"></div>
                  <span>Analyzing image...</span>
                </div>
                <div className="processing-steps-premium">
                  {msg.processingSteps?.map((step, idx) => (
                    <div key={idx} className={`processing-step-premium ${step.status}`}>
                      <div className="step-indicator">
                        {step.status === 'completed' && <span className="step-check">✓</span>}
                        {step.status === 'active' && <span className="step-dot active"></span>}
                        {step.status === 'pending' && <span className="step-dot"></span>}
                      </div>
                      <span className="step-text">{step.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {msg.type === 'oos-alert' && (
              <div className="agent-oos-alert">
                <div className="oos-content">
                  <div className="oos-header">
                    <div className="oos-alert-badge">
                      <span className="oos-pulse"></span>
                      Critical Alert
                    </div>
                    <span className="oos-count">{msg.analysisResult?.oosItems?.length || 0} Items Detected</span>
                  </div>
                  
                  <h3 className="oos-title">Out-of-Stock Detection Complete</h3>
                  <p className="oos-subtitle">2026 Dollar General Holiday Decor Planogram</p>
                  
                  {msg.image && (
                    <div 
                      className="oos-image-thumbnail"
                      onClick={() => setExpandedImage(msg.image || null)}
                    >
                      <img src={msg.image} alt="Analyzed shelf" />
                      <div className="oos-image-overlay">
                        <Eye size={20} />
                        <span>Click to expand</span>
                      </div>
                    </div>
                  )}

                  <div className="oos-items-list">
                    {msg.analysisResult?.oosItems?.map((item, idx) => (
                      <div key={idx} className="oos-item">
                        <div className="oos-item-number">{idx + 1}</div>
                        <div className="oos-item-info">
                          <strong>{item.name}</strong>
                          <span>{item.shelf} • {item.position}</span>
                        </div>
                        <span className="oos-badge">OOS</span>
                      </div>
                    ))}
                  </div>

                  {msg.task && (
                    <button 
                      className="agent-create-task-btn-premium"
                      onClick={() => handleCreateTask(msg.task!)}
                    >
                      <span className="btn-text">Create Replenishment Task</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {msg.type === 'deviation' && (
              <div className="compliance-report">
                <div className="report-header">
                  <div className="report-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="report-title-section">
                    <h3>POG Compliance Analysis Report</h3>
                    <p className="report-meta">Beverage End Cap - Large Format • Rural Core Cluster</p>
                  </div>
                </div>

                <div className="report-comparison">
                  <div className="comparison-images">
                    <div className="comparison-image uploaded">
                      <span className="image-label">Uploaded Image</span>
                      {msg.image && <img src={msg.image} alt="Uploaded shelf" />}
                    </div>
                    <div className="comparison-arrow">→</div>
                    <div className="comparison-image reference">
                      <span className="image-label">Localized POG Reference</span>
                      <img src="/assets/Localized - Beverage End Cap - Large Format.png" alt="Reference POG" />
                    </div>
                  </div>
                </div>

                <div className="report-summary-card">
                  <div className="summary-score">
                    <div className="score-circle">
                      <span className="score-number">58%</span>
                    </div>
                    <span className="score-text">Compliance Score</span>
                  </div>
                  <div className="summary-stats">
                    <div className="stat-item critical">
                      <span className="stat-count">3</span>
                      <span className="stat-label">Critical Issues</span>
                    </div>
                    <div className="stat-item warning">
                      <span className="stat-count">2</span>
                      <span className="stat-label">Warnings</span>
                    </div>
                    <div className="stat-item success">
                      <span className="stat-count">1</span>
                      <span className="stat-label">Compliant</span>
                    </div>
                  </div>
                </div>

                <div className="report-section">
                  <h4 className="section-title">
                    <AlertCircle size={16} />
                    Identified Deviations
                  </h4>
                  <div className="deviations-table">
                    {msg.analysisResult?.deviations?.map((dev, idx) => (
                      <div key={idx} className={`deviation-row ${dev.severity}`}>
                        <div className="deviation-status">
                          {dev.severity === 'critical' ? <X size={16} /> : 
                           dev.severity === 'warning' ? <AlertTriangle size={16} /> : 
                           <CheckCircle size={16} />}
                        </div>
                        <div className="deviation-product">
                          <strong>{dev.item}</strong>
                        </div>
                        <div className="deviation-comparison">
                          <div className="expected-value">
                            <span className="label">POG Spec:</span>
                            <span className="value">{dev.expected}</span>
                          </div>
                          <div className="actual-value">
                            <span className="label">Current:</span>
                            <span className="value">{dev.actual}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="report-section">
                  <h4 className="section-title">
                    <Wrench size={16} />
                    Corrective Actions for Store Team
                  </h4>
                  <div className="action-steps">
                    <div className="action-step">
                      <span className="step-number">1</span>
                      <div className="step-content">
                        <strong>Relocate Monster Energy to Shelf 1</strong>
                        <p>Move Monster Energy (Green) from current position to Shelf 1, Positions 1-4. Ensure 4 facings are visible with labels facing forward.</p>
                      </div>
                    </div>
                    <div className="action-step">
                      <span className="step-number">2</span>
                      <div className="step-content">
                        <strong>Adjust Red Bull Positioning</strong>
                        <p>Shift Red Bull Original to Shelf 1, Positions 5-8. Increase facings from 2 to 4 as per localized POG specification.</p>
                      </div>
                    </div>
                    <div className="action-step">
                      <span className="step-number">3</span>
                      <div className="step-content">
                        <strong>Restock Pepsi 20oz</strong>
                        <p>Product is missing from shelf. Retrieve from backstock and place on Shelf 2, Positions 7-10 with 4 facings.</p>
                      </div>
                    </div>
                    <div className="action-step">
                      <span className="step-number">4</span>
                      <div className="step-content">
                        <strong>Reposition Coca-Cola Classic</strong>
                        <p>Move Coca-Cola 20oz from Shelf 3 to Shelf 2, Positions 1-6. Add 2 additional facings to meet 6-facing requirement.</p>
                      </div>
                    </div>
                    <div className="action-step">
                      <span className="step-number">5</span>
                      <div className="step-content">
                        <strong>Add Dasani Water Facings</strong>
                        <p>Current display shows 6 facings. Add 2 more bottles to Positions 7-8 on Shelf 4 to complete the set.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {msg.task && (
                  <div className="report-action">
                    <button 
                      className="create-compliance-task-btn"
                      onClick={() => handleCreateTask(msg.task!)}
                    >
                      <Zap size={18} />
                      <span>Create Compliance Reset Task</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {msg.type === 'task-created' && (
              <div className="agent-task-created-premium">
                <div className="task-success-card">
                  <div className="task-success-icon">
                    <span>✓</span>
                  </div>
                  <div className="task-success-content">
                    <h4>Task Created Successfully</h4>
                    <p>Added to your Task List for immediate action</p>
                  </div>
                  <button 
                    className="view-tasks-btn-premium"
                    onClick={() => setActiveTab('taskList')}
                  >
                    View Tasks →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="agent-input-area">
        {agentImage && (
          <div className="agent-image-preview">
            <img src={agentImage} alt="To upload" />
            <button className="remove-image" onClick={() => setAgentImage(null)}>
              <X size={14} />
            </button>
          </div>
        )}
        <div className="agent-input-row">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleAgentImageUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="agent-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAgentProcessing}
          >
            <Camera size={20} />
          </button>
          <input
            type="text"
            className="agent-text-input"
            placeholder="Describe what you'd like me to analyze..."
            value={agentInput}
            onChange={(e) => setAgentInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAgentSubmit()}
            disabled={isAgentProcessing}
          />
          <button 
            className="agent-send-btn"
            onClick={handleAgentSubmit}
            disabled={isAgentProcessing || (!agentInput.trim() && !agentImage)}
          >
            {isAgentProcessing ? <Loader2 size={20} className="spinning" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );

  // Workflow content - kept for potential future use
  const _renderWorkflowContent = () => (
    <div className="exec-workflow-container">
      {renderWorkflowProgress()}
      <div className="exec-main-panel">
        {isStepLoading ? (
          <div className="exec-step-loading">
            <Loader2 size={32} className="spinning" />
            <h4>Loading next step...</h4>
            <p>Preparing data and validating selections</p>
          </div>
        ) : (
          <>
            {currentStep === 'select' && renderSelectStep()}
            {currentStep === 'upload' && renderUploadStep()}
            {currentStep === 'compare' && renderCompareStep()}
            {currentStep === 'tasks' && renderTasksStep()}
            {currentStep === 'assign' && renderAssignStep()}
          </>
        )}
      </div>
    </div>
  );
  void _renderWorkflowContent;

  return (
    <div className="exec-container">
      {/* Image Modal */}
      {expandedImage && (
        <div className="image-modal-overlay" onClick={() => setExpandedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setExpandedImage(null)}>
              <X size={24} />
            </button>
            <img src={expandedImage} alt="Expanded view" />
          </div>
        </div>
      )}
      
      <div className="exec-header">
        <div>
          <h1 className="exec-title">Store Execution</h1>
          <p className="exec-subtitle">
            Compare store layouts with localized planograms and generate actionable execution tasks
          </p>
        </div>
      </div>

      <div className="exec-tabs">
        <div className="exec-tabs-container">
          <button 
            className={`exec-tab ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent')}
          >
            <Bot size={16} />
            ShelfIQ Agent
          </button>
          <button 
            className={`exec-tab ${activeTab === 'taskList' ? 'active' : ''}`}
            onClick={() => setActiveTab('taskList')}
          >
            Task List
            {(sharedTasks.length + tasks.length) > 0 && <span className="exec-tab-badge">{sharedTasks.length + tasks.length}</span>}
          </button>
        </div>
      </div>

      <div className="exec-content">
        {activeTab === 'agent' ? renderAgentChat() : renderTaskListTab()}
      </div>
    </div>
  );
};

export default StoreExecution;
