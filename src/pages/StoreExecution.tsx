import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Lock,
  ChevronRight,
  Sparkles,
  Upload,
  Store,
  Calendar,
  // MessageSquare,
  AlertTriangle,
  ArrowRight,
  Plus,
  Minus,
  Move,
  Target,
  TrendingUp,
  User,
  Loader2,
  // Eye,
  FileText,
  Package,
  AlertCircle,
  Zap,
  RefreshCw,
  Tag,
  Wrench,
  UserPlus
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
  const { tasks: sharedTasks, assignTask, updateTaskStatus: updateSharedTaskStatus, teamMembers: sharedTeamMembers } = useExecutionTasks();
  const [activeTab, setActiveTab] = useState<'execution' | 'taskList'>('taskList');
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
          <button className="exec-go-workflow-btn" onClick={() => setActiveTab('execution')}>
            Go to Workflow
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

  const renderWorkflowContent = () => (
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

  return (
    <div className="exec-container">
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
            className={`exec-tab ${activeTab === 'execution' ? 'active' : ''}`}
            onClick={() => setActiveTab('execution')}
          >
            Execution Workflow
          </button>
          <button 
            className={`exec-tab ${activeTab === 'taskList' ? 'active' : ''}`}
            onClick={() => setActiveTab('taskList')}
          >
            Task List
            {tasks.length > 0 && <span className="exec-tab-badge">{tasks.length}</span>}
          </button>
        </div>
      </div>

      <div className="exec-content">
        {activeTab === 'execution' ? renderWorkflowContent() : renderTaskListTab()}
      </div>
    </div>
  );
};

export default StoreExecution;
