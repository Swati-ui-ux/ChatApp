const { getMessage } = require('../messageController');
const Message = require('../../models/message');

const { getMessage } = require('../messageController');
jest.mock("../../models/message");

describe('getMessage() getMessage method', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { userId: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });


  it('should return 200 and messages array when messages exist for user', async () => {
    const mockMessages = [
      { id: 1, message: 'Hello', userId: 'user123', createdAt: new Date() },
      { id: 2, message: 'World', userId: 'user123', createdAt: new Date() }
    ];
    Message.findAll.mockResolvedValue(mockMessages);

    await getMessage(req, res);

    expect(Message.findAll).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      order: [['createdAt', 'ASC']]
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockMessages);
  });

  it('should return 200 and empty array when user has no messages', async () => {
    Message.findAll.mockResolvedValue([]);

    await getMessage(req, res);

    expect(Message.findAll).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      order: [['createdAt', 'ASC']]
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });


  it('should return 404 when Message.findAll returns null', async () => {
    Message.findAll.mockResolvedValue(null);

    await getMessage(req, res);

    expect(Message.findAll).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      order: [['createdAt', 'ASC']]
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'message not found' });
  });

  it('should return 500 when Message.findAll throws an error', async () => {
    Message.findAll.mockRejectedValue(new Error('DB error'));

    await getMessage(req, res);

    expect(Message.findAll).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      order: [['createdAt', 'ASC']]
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'server error' });
  });

  it('should handle missing req.user gracefully and return 500', async () => {
    req = {};
    Message.findAll.mockImplementation(() => { throw new Error('Cannot read property userId'); });

    await getMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'server error' });
  });

  it('should handle undefined userId and return 500', async () => {
    req.user = {};
    Message.findAll.mockImplementation(() => { throw new Error('userId is undefined'); });

    await getMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'server error' });
  });
});