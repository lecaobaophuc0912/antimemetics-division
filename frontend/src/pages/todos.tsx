import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Todo, TodoRequestDto, TodoQueryParams } from '../services/api';
import { Navigation } from '../components/Navigation';
import { TodoHeader, TodoList, TodoSearch } from '../components/organisms';
import { TodoForm, ErrorMessage } from '../components/molecules';

export default function Todos() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailTodo, setShowDetailTodo] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState<TodoRequestDto>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [todoId, setTodoId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = useCallback(async (queryParams: TodoQueryParams = {}) => {
    try {
      setLoading(true)
      const response = await apiService.getTodos(queryParams);
      setTodos(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to synchronize neural tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const queryParams: TodoQueryParams = {};
      if (searchValue.trim()) {
        queryParams.search = searchValue.trim();
      }
      if (activeFilter !== 'all') {
        queryParams.status = activeFilter;
      }
      fetchTodos(queryParams);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, activeFilter, fetchTodos]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTodo = await apiService.createTodo({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });
      setTodos([newTodo, ...todos]);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setShowCreateForm(false);
      setError(null);
      fetchTodos();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize neural task');
    }
  };

  const handleOpenDetailTodo = async (id: string) => {
    try {
      const response = await apiService.getTodo(id);
      console.log(response);
      const todo = response.data;
      setFormData({
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate.split('T')[0]
      });
      setTodoId(id);
      setShowDetailTodo(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to access neural task data');
    }
  };

  const handleCloseDetailTodo = () => {
    setShowDetailTodo(false);
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoId) return;
    try {
      await apiService.updateTodo(todoId, {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });
      setShowDetailTodo(false);
      setError(null);
      fetchTodos();
    } catch (err: any) {
      setError(err.message || 'Failed to update neural task');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to terminate neural task');
    }
  };

  const handleAddClick = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  const handleUpdateCancel = () => {
    setShowDetailTodo(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleClearFilter = () => {
    setActiveFilter('all');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black relative">
        {/* Scanning line effect */}
        <div className="scan-line"></div>

        {/* Navigation */}
        <Navigation user={user} logout={logout} />

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <TodoHeader onAddClick={handleAddClick} />

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Search and Filter */}
          <TodoSearch
            todos={todos}
            filteredTodos={todos}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onClearSearch={handleClearSearch}
            onClearFilter={handleClearFilter}
          />

          {/* Create Todo Form */}
          {showCreateForm && (
            <TodoForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateTodo}
              onCancel={handleCreateCancel}
              title="Initialize Neural Task"
              submitText="Initialize Task"
            />
          )}

          {/* Update Todo Form */}
          {showDetailTodo && (
            <TodoForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateTodo}
              onCancel={handleUpdateCancel}
              title="Neural Task Details"
              submitText="Update Task"
            />
          )}

          {/* Todos List */}
          <TodoList
            todos={todos}
            loading={loading}
            onEdit={handleOpenDetailTodo}
            onDelete={handleDeleteTodo}
            onCreateClick={handleAddClick}
          />
        </main>

        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 