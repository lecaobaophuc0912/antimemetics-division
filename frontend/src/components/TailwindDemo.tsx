import React from 'react';

const TailwindDemo: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold neon-glow">
                        Tailwind CSS Demo
                    </h1>
                    <p className="text-lg text-muted">
                        Testing custom theme and utilities
                    </p>
                </div>

                {/* Color Palette */}
                <div className="glass p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 neon-glow-secondary">
                        Color Palette
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-primary rounded"></div>
                            <p className="text-sm">Primary</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-secondary rounded"></div>
                            <p className="text-sm">Secondary</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-accent rounded"></div>
                            <p className="text-sm">Accent</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-warning rounded"></div>
                            <p className="text-sm">Warning</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-error rounded"></div>
                            <p className="text-sm">Error</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-success rounded"></div>
                            <p className="text-sm">Success</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-muted rounded"></div>
                            <p className="text-sm">Muted</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-16 bg-border rounded"></div>
                            <p className="text-sm">Border</p>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="glass-secondary p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 neon-glow-accent">
                        Buttons
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 bg-primary text-background font-bold rounded hover:shadow-glow transition-all duration-300">
                            Primary Button
                        </button>
                        <button className="px-6 py-3 bg-secondary text-background font-bold rounded hover:shadow-glow-secondary transition-all duration-300">
                            Secondary Button
                        </button>
                        <button className="px-6 py-3 bg-accent text-background font-bold rounded hover:shadow-glow-accent transition-all duration-300">
                            Accent Button
                        </button>
                        <button className="px-6 py-3 border border-primary text-primary font-bold rounded hover:bg-primary hover:text-background transition-all duration-300">
                            Outline Button
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-lg hover:shadow-glow transition-all duration-300">
                        <h3 className="text-xl font-bold mb-2">Card 1</h3>
                        <p className="text-muted">This is a sample card with glass effect.</p>
                    </div>
                    <div className="glass-secondary p-6 rounded-lg hover:shadow-glow-secondary transition-all duration-300">
                        <h3 className="text-xl font-bold mb-2">Card 2</h3>
                        <p className="text-muted">This is a sample card with secondary glass effect.</p>
                    </div>
                    <div className="glass-accent p-6 rounded-lg hover:shadow-glow-accent transition-all duration-300">
                        <h3 className="text-xl font-bold mb-2">Card 3</h3>
                        <p className="text-muted">This is a sample card with accent glass effect.</p>
                    </div>
                </div>

                {/* Typography */}
                <div className="glass p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Typography</h2>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">Heading 1</h1>
                        <h2 className="text-3xl font-bold">Heading 2</h2>
                        <h3 className="text-2xl font-bold">Heading 3</h3>
                        <h4 className="text-xl font-bold">Heading 4</h4>
                        <p className="text-base">Regular paragraph text with normal styling.</p>
                        <p className="text-sm text-muted">Small muted text for secondary information.</p>
                        <code className="terminal-text text-sm bg-muted px-2 py-1 rounded">
                            Code snippet example
                        </code>
                    </div>
                </div>

                {/* Animations */}
                <div className="glass p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Animations</h2>
                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-primary rounded animate-pulse-glow"></div>
                        <div className="w-16 h-16 bg-secondary rounded animate-pulse"></div>
                        <div className="w-16 h-16 bg-accent rounded animate-bounce"></div>
                    </div>
                </div>

                {/* Grid Background */}
                <div className="cyber-grid h-32 rounded-lg flex items-center justify-center">
                    <p className="text-lg font-bold neon-glow">
                        Cyber Grid Background
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TailwindDemo; 