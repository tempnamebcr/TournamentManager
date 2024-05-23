import React from 'react';

class ChatInput extends React.Component {
    render() {
        const { form, method } = this.props;

        return (
            <div className="flex gap-x-3 items-end mt-5 px-3 py-3">
                <input
                    type="text"
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Say something..."
                    value={form.body}
                    onChange={(e) => this.props.onInputChange('body', e.target.value)} // Assuming you have a function to handle input change
                    onKeyUp={(e) => { if (e.key === 'Enter') method() }}
                />
                <button
                    className={`inline-flex items-center justify-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest mt-5 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-600 transition ease-in-out duration-150 ${form.processing ? 'opacity-25' : ''}`}
                    disabled={form.processing}
                    onClick={method}
                >
                    Send
                </button>
            </div>
        );
    }
}

export default ChatInput;
