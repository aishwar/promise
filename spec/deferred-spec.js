var h = require('./spec-helper.js');
var Deferred = require('../index.js').Deferred;

describe('Deferred objects', function () {
  describe('interface', function () {
    it('contains all the required methods', function () {
      var value = this.value = new Deferred();
      
      // Verifies the deferred object creation
      expect(value).toBeDefined();
      expect(value.constructor).toEqual(Deferred);
      
      // Verifying method definitions
      expect(typeof(value.succeeds)).toBe('function');
      expect(typeof(value.fails)).toBe('function');
      expect(typeof(value.completes)).toBe('function');
      expect(typeof(value.isResolved)).toBe('function');
      expect(typeof(value.isRejected)).toBe('function');
    });
    
    it('can be chained through the succeeds, fails and completes methods', function () {
      var value = new Deferred();
      
      // i.e., succeeds, fails and completes methods should return the same deferred object
      expect(value.succeeds()).toBe(value);
      expect(value.fails()).toBe(value);
      expect(value.completes()).toBe(value);
    });
  });
  
  describe('behaviour when status is "unfulfilled"', function () {
    describe('and changes to "resolved"', function () {
      it('runs the success and completion callbacks on success', function () {
        runs(function () {
          this.value = h.delayedSuccess();
          this.status = '';
          var self = this;
          
          this.value.
            succeeds(function () {
              self.status += 'a';
            }).
            succeeds(function () {
              self.status += 'b';
            }).
            fails(function () {
              self.status += 'c';
            }).
            fails(function () {
              self.status += 'd';
            }).
            completes(function () {
              self.status += 'e';
            });
        });
        
        runs(function () {
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('abe');
        });
      });
      
      it('changes the status of the deferred object', function () {
        runs(function () {
          this.value = h.delayedSuccess();
          expect(this.value.isResolved()).toEqual(false);
          expect(this.value.isRejected()).toEqual(false);
        });
        
        waits(200);
        
        runs(function () {
          expect(this.value.isResolved()).toEqual(true);
          expect(this.value.isRejected()).toEqual(false);
        });
      });
      
      it('passes arguments passed to the resolve method to the success and completion callback functions', function () {
        runs(function () {
          this.value = h.deferredSuccessReturningNumbers1to5();
          this.status = '';
          var self = this;
          
          this.value.
            succeeds(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'a';
              }
            }).
            succeeds(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'b';
              }
            }).
            fails(function () {
              self.status += 'c';
            }).
            completes(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'd';
              }
            });
          
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('abd');
        });
      });
    });
    
    describe('and changes to "rejected"', function () {
      it('runs the failure and completion callbacks on failure', function () {
        runs(function () {
          this.value = h.delayedFailure();
          this.status = '';
          var self = this;
          
          this.value.
            succeeds(function () {
              self.status += 'a';
            }).
            succeeds(function () {
              self.status += 'b';
            }).
            fails(function () {
              self.status += 'c';
            }).
            fails(function () {
              self.status += 'd';
            }).
            completes(function () {
              self.status += 'e';
            });
        });
        
        runs(function () {
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('cde');
        });
      });
      
      it('changes the status of the deferred object', function () {
        runs(function () {
          this.value = h.delayedFailure();
          expect(this.value.isResolved()).toEqual(false);
          expect(this.value.isRejected()).toEqual(false);
        });
        
        waits(200);
        
        runs(function () {
          expect(this.value.isResolved()).toEqual(false);
          expect(this.value.isRejected()).toEqual(true);
        });
      });
      
      it('passes arguments passed to the reject method to the failure and completion callback functions', function () {
        runs(function () {
          this.value = h.deferredFailureReturningNumbers1to5();
          this.status = '';
          var self = this;
          
          this.value.
            fails(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'a';
              }
            }).
            fails(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'b';
              }
            }).
            succeeds(function () {
              self.status += 'c';
            }).
            completes(function (a, b, c, d, e) {
              if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
              {
                self.status += 'd';
              }
            });
          
          expect(this.status).toEqual('');
        });
        
        waits(200);
        
        runs(function () {
          expect(this.status).toEqual('abd');
        });
      });
    });
  });
  
  
  describe('behaviour when status is either "resolved" or "rejected"', function () {
    it('cannot be resolved again (testing trying to resolve resolved)', function () {
      runs(function () {
        this.value = h.delayedSuccess();
        this.status = '';
        var self = this;
        
        this.value.
          succeeds(function () {
            self.status += 'a';
          }).
          succeeds(function () {
            self.status += 'b';
          });
      });
      
      waits(200);
      
      runs(function () {
        expect(this.status).toEqual('ab');
        this.value.resolve();
        expect(this.status).toEqual('ab');
      });
    });
    
    it('cannot be resolved again (testing trying to resolve rejected)', function () {
      runs(function () {
        this.value = h.delayedFailure();
        this.status = '';
        var self = this;
        
        this.value.
          succeeds(function () {
            self.status += 'a';
          }).
          succeeds(function () {
            self.status += 'b';
          }).
          fails(function () {
            self.status += 'c';
          }).
          fails(function () {
            self.status += 'd';
          });
      });
      
      waits(200);
      
      runs(function () {
        expect(this.status).toEqual('cd');
        this.value.resolve();
        expect(this.status).toEqual('cd');
      });
    });
    
    it('cannot be rejected again (testing trying to reject resolved)', function () {
      runs(function () {
        this.value = h.delayedSuccess();
        this.status = '';
        var self = this;
        
        this.value.
          succeeds(function () {
            self.status += 'a';
          }).
          succeeds(function () {
            self.status += 'b';
          }).
          fails(function () {
            self.status += 'c';
          }).
          fails(function () {
            self.status += 'd';
          });
      });
      
      waits(200);
      
      runs(function () {
        expect(this.status).toEqual('ab');
        this.value.reject();
        expect(this.status).toEqual('ab');
      });
    });
    
    it('cannot be rejected again (testing trying to reject rejected)', function () {
      runs(function () {
        this.value = h.delayedFailure();
        this.status = '';
        var self = this;
        
        this.value.
          succeeds(function () {
            self.status += 'a';
          }).
          succeeds(function () {
            self.status += 'b';
          }).
          fails(function () {
            self.status += 'c';
          }).
          fails(function () {
            self.status += 'd';
          });
      });
      
      waits(200);
      
      runs(function () {
        expect(this.status).toEqual('cd');
        this.value.reject();
        expect(this.status).toEqual('cd');
      });
    });
    
    it('executes any new success/completion callbacks immediately when the status is "resolved"', function () {
      runs(function () {
        this.value = h.delayedSuccess();
        this.status = '';
        var self = this;
        
        this.value.
          succeeds(function () {
            self.status += 'a';
          }).
          succeeds(function () {
            self.status += 'b';
          });
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        expect(this.value.isResolved()).toEqual(true);
        expect(this.status).toEqual('ab');
        
        var self = this;
        
        this.value.succeeds(function () {
          self.status += 'c';
        });
        
        expect(this.status).toEqual('abc');
        
        this.value.completes(function () {
          self.status += 'd';
        });
        
        expect(this.status).toEqual('abcd');
      });
    });

    it('executes any new failure/completion callbacks immediately when the status is "rejected"', function () {
      runs(function () {
        this.value = h.delayedFailure();
        this.status = '';
        var self = this;
        
        this.value.
          fails(function () {
            self.status += 'a';
          }).
          fails(function () {
            self.status += 'b';
          });
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        expect(this.value.isRejected()).toEqual(true);
        expect(this.status).toEqual('ab');
        
        var self = this;
        
        this.value.fails(function () {
          self.status += 'c';
        });
        
        expect(this.status).toEqual('abc');
        
        this.value.completes(function () {
          self.status += 'd';
        });
        
        expect(this.status).toEqual('abcd');
      });
    });
    
    
    it('passes arguments that were passed to the resolve method, to the success and completion callback functions', function () {
      runs(function () {
        this.value = h.deferredSuccessReturningNumbers1to5();
        this.status = '';
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        var self = this;
        
        this.value.
          succeeds(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'a';
            }
          }).
          succeeds(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'b';
            }
          }).
          fails(function () {
            self.status += 'c';
          }).
          completes(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'd';
            }
          });
        
        expect(this.value.isResolved()).toEqual(true);
        expect(this.status).toEqual('abd');
      });
    });
    
    it('passes arguments that were passed to the reject method, to the failure and completion callback functions', function () {
      runs(function () {
        this.value = h.deferredFailureReturningNumbers1to5();
        this.status = '';
        
        expect(this.status).toEqual('');
      });
      
      waits(200);
      
      runs(function () {
        var self = this;
        
        this.value.
          fails(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'a';
            }
          }).
          fails(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'b';
            }
          }).
          succeeds(function () {
            self.status += 'c';
          }).
          completes(function (a, b, c, d, e) {
            if (a == 1 && b == 2 && c == 3 && d == 4 && e == 5)
            {
              self.status += 'd';
            }
          });
        
        expect(this.value.isRejected()).toEqual(true);
        expect(this.status).toEqual('abd');
      });
    })
  });
});

