#!/bin/bash

echo "Setting up i18n for frontend..."

# Install next-intl
echo "Installing next-intl..."
npm install next-intl

# Create necessary directories
echo "Creating directories..."
mkdir -p src/hooks
mkdir -p messages

echo "i18n setup completed!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3001/en for English"
echo "3. Visit http://localhost:3001/vi for Vietnamese"
echo "4. Use the language switcher in the navigation to change languages"
echo ""
echo "For more information, see I18N_README.md" 